import {curry, map, prop, toLower} from 'rambda';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  InstrumentModel,
  LevelType,
  Order,
  OrderBookCellType,
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
  fillBySide,
  findAndDeleteDuplicatedAnimatedLevel,
  getCellType,
  getOpacityForAnimation,
  getY,
  updateAnimatingLevelsWithNewLevel
} from './helpers/LevelListHelpers';
import {LEFT_PADDING, LEVELS_COUNT, TOP_PADDING} from './index';
import {FakeOrderBookStage} from './styles';

const LEVEL_FONT = `12.25px Proxima Nova`;
const UPDATE_ANIMATION_INTERVAL = 80;
const CELLS_NUMBER = 3;

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
  isPageVisible: () => boolean;
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
  isAnimationReached: boolean;
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

  handleLevelsUpdating = (asks: Order[], bids: Order[], type: LevelType) => {
    if (!this.props.isPageVisible()) {
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
      height
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

    defineCanvasScale(this.canvasCtx, this.canvas, width, height);
  }

  prepareLevelForDrawing = (normalize: any, levelHeight: number) => {
    const {displayType, instrument, format, width} = this.props;
    const isAnimationPrevented = !this.cachedLevels.length;

    return (levelOrder: Order, index: number) => {
      const existedLevel = this.cachedLevels.find(
        cachedLevel => cachedLevel.price === levelOrder.price
      );
      const color = fillBySide(levelOrder.side);

      let barOpacity = DEFAULT_BAR_OPACITY;
      const isChangingLevel =
        existedLevel && existedLevel[displayType] !== levelOrder[displayType];

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

        const existedAnimatingLevel = this.animatingLevels.find(
          animatingLevel => animatingLevel.price === levelOrder.price
        );

        if (existedAnimatingLevel) {
          barOpacity = getOpacityForAnimation(existedAnimatingLevel);
        }
      }

      const y = getY(levelOrder.side, index, levelHeight);
      const canvasY = getY(
        levelOrder.side,
        levelOrder.side === Side.Sell ? index - 1 : index + 1,
        levelHeight
      );

      const value = format(
        levelOrder[displayType] * levelOrder.price,
        instrument.quoteAsset.accuracy
      );

      drawRect({
        ctx: this.canvasCtx,
        color,
        x: width / CELLS_NUMBER,
        y,
        width: normalize(levelOrder[displayType]),
        height: levelHeight,
        opacity: barOpacity
      });

      if (levelOrder.connectedLimitOrders.length > 0) {
        drawVerticalLine({
          ctx: this.canvasCtx,
          x: width / CELLS_NUMBER + 1,
          y: y + 2,
          height: y + levelHeight - 2,
          lineWidth: 2,
          color,
          lineCap: 'round'
        });
      }

      drawLine({
        ctx: this.canvasCtx,
        width,
        y: canvasY,
        x: LEFT_PADDING,
        color: colors.graphiteBorder,
        lineWidth: 1
      });

      drawText({
        ctx: this.canvasCtx,
        color,
        text: format(levelOrder.price, this.props.spanAccuracy),
        x: LEFT_PADDING,
        y: canvasY - TOP_PADDING,
        font: LEVEL_FONT,
        align: 'start'
      });
      this.levelsCells.push({
        left: LEFT_PADDING,
        top: y,
        width: width / CELLS_NUMBER - LEFT_PADDING,
        height: levelHeight,
        type: OrderBookCellType.Price,
        value: levelOrder.price,
        side: levelOrder.side
      });

      const volume = format(
        levelOrder[displayType],
        instrument.baseAsset.accuracy
      );

      if (hasTrailingZeroes(volume)) {
        let drownSymbolsWidth = 0;
        const trailingZeroPosition = getTrailingZeroOppositePosition(volume);
        const symbols = volume.split('');
        const getSymbolOpacity = colorizedSymbol(1);

        symbols.forEach((symbol: string, i: number) => {
          const symbolOpacity = getSymbolOpacity(trailingZeroPosition, i);
          drawText({
            ctx: this.canvasCtx,
            color,
            text: symbol,
            x: width / CELLS_NUMBER + LEFT_PADDING + drownSymbolsWidth,
            y: canvasY - TOP_PADDING,
            font: LEVEL_FONT,
            align: 'start',
            opacity: symbolOpacity
          });
          drownSymbolsWidth += this.canvasCtx!.measureText(symbol).width;
        });
      } else {
        drawText({
          ctx: this.canvasCtx,
          color,
          text: volume,
          x: width / CELLS_NUMBER + LEFT_PADDING,
          y: canvasY - TOP_PADDING,
          font: LEVEL_FONT,
          align: 'start'
        });
      }

      this.levelsCells.push({
        left: width / CELLS_NUMBER,
        top: y,
        width: width / CELLS_NUMBER,
        height: levelHeight,
        type: getCellType(displayType),
        value: levelOrder.depth,
        side: levelOrder.side
      });

      drawText({
        ctx: this.canvasCtx,
        color: colors.white,
        text: value,
        x: width,
        y: canvasY - TOP_PADDING,
        font: LEVEL_FONT,
        align: 'end'
      });
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

    const drawLevel = this.prepareLevelForDrawing(normalize, levelHeight);

    levels.forEach(drawLevel);
    this.animatingLevels = this.animatingLevels.filter(al => !al.isAnimated);
    this.cachedLevels = [...levels];
  };

  componentWillReceiveProps({width}: LevelListProps) {
    window.requestAnimationFrame(() => {
      if (width !== this.prevWidth) {
        this.prevWidth = width;
        defineCanvasScale(
          this.canvasCtx,
          this.canvas,
          width,
          this.props.height
        );
      }
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
            width={width / CELLS_NUMBER * 2}
            height={height}
            onMouseDown={this.handleMouseDownOnFakeStage}
            ref={this.setFakeStageRef}
          />
        )}
        <canvas width={width} height={height} ref={this.setCanvasRef} />
      </React.Fragment>
    );
  }
}

export default LevelList;
