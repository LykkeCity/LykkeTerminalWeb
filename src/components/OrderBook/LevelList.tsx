import {curry, map, prop, toLower} from 'rambda';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  InstrumentModel,
  LevelType,
  Order,
  OrderBookCellType,
  OrderBookDisplayType,
  Side
} from '../../models';
import {mapToEffectivePrice} from '../../models/mappers/orderMapper';
import {normalizeVolume} from '../../utils';
import {
  defineCanvasScale,
  drawLine,
  drawRect,
  drawText,
  drawVerticalLine
} from '../../utils/canvasUtils';
import {
  getTrailingZeroOppositePosition,
  hasTrailingZeroes
} from '../../utils/string';
import {colors} from '../styled';
import {
  colorizedSymbol,
  DEFAULT_BAR_OPACITY,
  DEFAULT_OPACITY,
  fillBySide,
  findAndDeleteDuplicatedAnimatedLevel,
  getCellType,
  getColorAndOpacityForAnimation,
  getY,
  updateAnimatingLevelsWithNewLevel
} from './helpers/LevelListHelpers';
import {BAR_WIDTH, LEFT_PADDING, LEVELS_COUNT, TOP_PADDING} from './index';
import {FakeOrderBookStage} from './styles';

const LEVEL_FONT = `12.25px Lekton, monospace`;
const UPDATE_ANIMATION_INTERVAL = 250;
const CELLS_NUMBER = 3;
const SCALE_BAR = 3;
const MARGIN_BOTTOM = 3;

export interface LevelListProps {
  levels: Order[];
  instrument: InstrumentModel;
  format: (num: number, accuracy: number) => string;
  normalize: (num: number) => number;
  height: number;
  width: number;
  isReadOnly: boolean;
  getAsks: () => Order[];
  getBids: () => Order[];
  displayType: string;
  setLevelsUpdatingHandler: (
    fn: (asks: Order[], bids: Order[], type: LevelType) => void
  ) => void;
  triggerOrderUpdate: (clickedEl: any) => void;
  type: LevelType;
  spanAccuracy: number;
  setSpanUpdatingHandler: (levelType: LevelType, fn: () => void) => void;
}

interface ILevelsCells {
  left: number;
  top: number;
  width: number;
  height: number;
  type: OrderBookCellType;
  value: number;
  side: Side;
}

export interface IAnimatingLevels {
  isAnimated: boolean;
  currentOpacity: number;
  price: number;
}

class LevelList extends React.Component<LevelListProps> {
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  levelsCells: ILevelsCells[] = [];
  fakeStage: HTMLDivElement;
  prevWidth: number = 0;
  cachedLevels: Order[] = [];
  cancelColorAnimationIntervalId: any;
  animatingLevels: IAnimatingLevels[] = [];
  isPageVisible: boolean = true;

  handleLevelsUpdating = (asks: Order[], bids: Order[], type: LevelType) => {
    if (!this.isPageVisible) {
      // TODO delete after disconnect from wamp task will be implement
      return;
    }
    window.requestAnimationFrame(() => {
      this.renderCanvas(asks, bids, type);
      this.forceUpdate();

      clearInterval(this.cancelColorAnimationIntervalId);

      this.cancelColorAnimationIntervalId = setInterval(() => {
        if (this.animatingLevels.length) {
          this.renderCanvas(asks, bids, type);
          this.forceUpdate();
        } else {
          clearInterval(this.cancelColorAnimationIntervalId);
        }
      }, UPDATE_ANIMATION_INTERVAL);
    });
  };

  handleSpanUpdating = () => {
    this.clearCachedLevels();
    this.clearAnimatingLevels();
  };

  togglePointerEvents = (value: string) =>
    ((ReactDOM.findDOMNode(this.fakeStage) as HTMLDivElement).style[
      'pointer-events'
    ] = value);

  componentDidMount() {
    const {
      setLevelsUpdatingHandler,
      triggerOrderUpdate,
      setSpanUpdatingHandler,
      type,
      width,
      height,
      getAsks,
      getBids
    } = this.props;
    setLevelsUpdatingHandler(this.handleLevelsUpdating);
    setSpanUpdatingHandler(type, this.handleSpanUpdating);

    this.canvasCtx = this.canvas!.getContext('2d');
    this.canvas!.addEventListener(
      'mouseup',
      (event: any) => {
        if (this.props.isReadOnly) {
          return;
        }

        const x = event.offsetX;
        const y = event.offsetY;

        const clickedLevelElement = this.levelsCells.find(
          el =>
            y > el.top &&
            y < el.top + el.height &&
            x > el.left &&
            x < el.left + el.width
        );

        if (clickedLevelElement) {
          triggerOrderUpdate(clickedLevelElement);
        }
        this.togglePointerEvents('auto');
      },
      false
    );

    document.addEventListener(
      'visibilitychange',
      () => {
        this.isPageVisible = document.visibilityState === 'visible';
        this.handleLevelsUpdating(getAsks(), getBids(), type);
      },
      false
    );

    defineCanvasScale(this.canvasCtx, this.canvas, width, height);
  }

  drawBar = (color: string, y: number, normalizedWidth: number) => {
    drawRect({
      ctx: this.canvasCtx!,
      color,
      x: LEFT_PADDING,
      y,
      width: normalizedWidth,
      height: this.props.height / LEVELS_COUNT,
      opacity: DEFAULT_BAR_OPACITY
    });
  };

  drawConnectedOrders = (color: string, y: number) => {
    drawVerticalLine({
      ctx: this.canvasCtx!,
      x: 1 + LEFT_PADDING,
      y: y + 2,
      height: y + this.props.height / LEVELS_COUNT - 2,
      lineWidth: 2,
      color,
      lineCap: 'round'
    });
  };

  drawLevelBorder = (width: number, y: number) => {
    drawLine({
      ctx: this.canvasCtx!,
      width,
      y,
      x: LEFT_PADDING,
      color: colors.graphiteBorder,
      lineWidth: 1
    });
  };

  drawAndSavePrice = (
    color: string,
    canvasY: number,
    y: number,
    price: number,
    side: Side
  ) => {
    const {spanAccuracy, width, height, format} = this.props;
    drawText({
      ctx: this.canvasCtx!,
      color,
      text: format(price, spanAccuracy),
      x: BAR_WIDTH,
      y: canvasY - TOP_PADDING,
      font: LEVEL_FONT,
      align: 'start'
    });

    this.levelsCells.push({
      left: BAR_WIDTH,
      top: y + MARGIN_BOTTOM,
      width: (width - BAR_WIDTH) / CELLS_NUMBER,
      height: height / LEVELS_COUNT,
      type: OrderBookCellType.Price,
      value: price,
      side
    });
  };

  drawVolume = (
    volumeColor: string,
    volume: string,
    volumeOpacity: number,
    canvasY: number,
    x: number
  ) => {
    drawText({
      ctx: this.canvasCtx!,
      color: volumeColor,
      text: volume,
      x,
      y: canvasY - TOP_PADDING,
      font: LEVEL_FONT,
      align: 'start',
      opacity: volumeOpacity
    });
  };

  saveVolume = (
    displayType: OrderBookCellType,
    depth: number,
    side: Side,
    y: number
  ) => {
    const {width, height} = this.props;
    this.levelsCells.push({
      left: (width - BAR_WIDTH) / CELLS_NUMBER + BAR_WIDTH,
      top: y + MARGIN_BOTTOM,
      width: (width - BAR_WIDTH) / CELLS_NUMBER,
      height: height / LEVELS_COUNT,
      type: getCellType(displayType),
      value: depth,
      side
    });
  };

  drawValue = (value: string, y: number) => {
    drawText({
      ctx: this.canvasCtx!,
      color: colors.white,
      text: value,
      x: this.props.width,
      y: y - TOP_PADDING,
      font: LEVEL_FONT,
      align: 'end'
    });
  };

  prepareLevelForDrawing = (
    normalize: any,
    levelHeight: number,
    levels: Order[]
  ) => {
    const {displayType, instrument, format, width} = this.props;
    const isAnimationPrevented = !this.cachedLevels.length;

    const levelsWidth = width - BAR_WIDTH;

    return (levelOrder: Order, index: number) => {
      let value;
      const existedLevel = this.cachedLevels.find(
        cachedLevel => cachedLevel.price === levelOrder.price
      );
      const color = fillBySide(levelOrder.side);

      let volumeColor = colors.white;
      let volumeOpacity = DEFAULT_OPACITY;
      const isChangingLevel =
        existedLevel && existedLevel[displayType] !== levelOrder[displayType];
      let existedAnimatingLevel: IAnimatingLevels | undefined;

      if (isChangingLevel) {
        this.animatingLevels = findAndDeleteDuplicatedAnimatedLevel(
          this.animatingLevels,
          levelOrder.price
        );
      }

      if (!isAnimationPrevented) {
        if (
          !existedLevel ||
          existedLevel[displayType] !== levelOrder[displayType]
        ) {
          this.animatingLevels = updateAnimatingLevelsWithNewLevel(
            this.animatingLevels,
            levelOrder.price
          );
        }

        existedAnimatingLevel = this.animatingLevels.find(
          animatingLevel => animatingLevel.price === levelOrder.price
        );

        if (existedAnimatingLevel) {
          const {
            animatedColor,
            animatedOpacity
          } = getColorAndOpacityForAnimation(existedAnimatingLevel, color);
          volumeColor = animatedColor;
          volumeOpacity = animatedOpacity;
        }
      }

      const y = getY(levelOrder.side, index, levelHeight);
      const canvasY = getY(
        levelOrder.side,
        levelOrder.side === Side.Sell ? index - 1 : index + 1,
        levelHeight
      );

      if (displayType === toLower(OrderBookDisplayType.Depth)) {
        const arr = levels.slice(0, index + 1);
        const sumVolume = arr.reduce((sum, cur) => sum + cur.volume, 0);
        value = mapToEffectivePrice(sumVolume, arr)!;
      } else {
        value = levelOrder.volume * levelOrder.price;
      }
      value = format(value, instrument.quoteAsset.accuracy);

      const normalizedWidth = normalize(levelOrder[displayType]) / SCALE_BAR;

      this.drawBar(color, y, normalizedWidth);

      if (levelOrder.connectedLimitOrders.length > 0) {
        this.drawConnectedOrders(color, y);
      }

      this.drawLevelBorder(width, canvasY);

      this.drawAndSavePrice(
        color,
        canvasY,
        y,
        levelOrder.price,
        levelOrder.side
      );

      const volume = format(
        levelOrder[displayType],
        instrument.baseAsset.accuracy
      );

      if (hasTrailingZeroes(volume)) {
        let drownSymbolsWidth = 0;
        const trailingZeroPosition = getTrailingZeroOppositePosition(volume);
        const symbols = volume.split('');
        const getSymbolColor = colorizedSymbol(volumeColor);

        symbols.forEach((symbol: string, i: number) => {
          const symbolColor =
            existedAnimatingLevel && !existedAnimatingLevel.isAnimated
              ? volumeColor
              : getSymbolColor(trailingZeroPosition, i);
          const x = levelsWidth / CELLS_NUMBER + BAR_WIDTH + drownSymbolsWidth;

          this.drawVolume(symbolColor, symbol, volumeOpacity, canvasY, x);
          drownSymbolsWidth += this.canvasCtx!.measureText(symbol).width;
        });
      } else {
        const x = levelsWidth / CELLS_NUMBER + BAR_WIDTH;
        this.drawVolume(volumeColor, volume, volumeOpacity, canvasY, x);
      }

      this.saveVolume(
        levelOrder[displayType],
        levelOrder.depth,
        levelOrder.side,
        y
      );

      this.drawValue(value, canvasY);
    };
  };

  drawCanvas = (asks: Order[] = [], bids: Order[] = [], type: LevelType) => {
    this.levelsCells = [];
    const {displayType, height} = this.props;

    const levels = type === LevelType.Asks ? asks : bids;

    const levelHeight = height / LEVELS_COUNT;
    const vals = map(prop(toLower(displayType)), [
      ...asks,
      ...bids
    ]) as number[];
    const normalize = curry(normalizeVolume)(
      Math.min(...vals),
      Math.max(...vals)
    );

    const drawLevel = this.prepareLevelForDrawing(
      normalize,
      levelHeight,
      levels
    );

    levels.forEach(drawLevel);
    this.animatingLevels = this.animatingLevels.filter(al => !al.isAnimated);
    this.cachedLevels = [...levels];
  };

  componentWillReceiveProps({width, height}: LevelListProps) {
    window.requestAnimationFrame(() => {
      defineCanvasScale(this.canvasCtx, this.canvas, width, height);
      const asks = this.props.getAsks();
      const bids = this.props.getBids();
      if (!asks.length && !bids.length) {
        this.clearCachedLevels();
        this.clearCanvas();
      } else {
        this.renderCanvas(asks, bids, this.props.type);
      }
      this.forceUpdate();
    });
  }

  clearCanvas = () => {
    if (this.canvas) {
      this.canvasCtx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  clearCachedLevels = () => (this.cachedLevels = []);
  clearAnimatingLevels = () => (this.animatingLevels = []);

  renderCanvas = (asks: Order[], bids: Order[], type: LevelType) => {
    this.clearCanvas();
    this.drawCanvas(asks, bids, type);
  };

  setFakeStageRef = (div: any) => (this.fakeStage = div);
  setCanvasRef = (canvas: any) => (this.canvas = canvas);
  handleMouseDownOnFakeStage = () => this.togglePointerEvents('none');

  render() {
    const {isReadOnly, width, height} = this.props;
    return (
      <React.Fragment>
        {!isReadOnly && (
          <FakeOrderBookStage
            width={((width - BAR_WIDTH) / CELLS_NUMBER) * 2}
            height={height}
            onMouseDown={this.handleMouseDownOnFakeStage}
            ref={this.setFakeStageRef}
            left={BAR_WIDTH + LEFT_PADDING}
            bottom={MARGIN_BOTTOM}
          />
        )}
        <canvas
          width={width}
          height={height}
          ref={this.setCanvasRef}
          style={{marginBottom: `-${MARGIN_BOTTOM}px`}}
        />
      </React.Fragment>
    );
  }
}

export default LevelList;
