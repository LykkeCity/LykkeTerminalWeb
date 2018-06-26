import * as React from 'react';
import ReactDOM from 'react-dom';

import {colors} from '../styled';

import {InstrumentModel, Order, OrderBookDisplayType, Side} from '../../models';
import {mapToEffectivePrice} from '../../models/mappers/orderMapper';
import {LEFT_PADDING, LEVELS_COUNT, TOP_PADDING} from './index';

import {curry, map, prop, toLower} from 'rambda';
import {normalizeVolume} from '../../utils';
import {
  defineCanvasScale,
  drawLine,
  drawRect,
  drawText,
  drawVerticalLine
} from '../../utils/canvasUtils';

import LevelType from '../../models/levelType';
import OrderBookCellType from '../../models/orderBookCellType';
import {
  getTrailingZeroStartPosition,
  hasTrailingZeroes
} from '../../utils/string';
import {FakeOrderBookStage} from './styles';

const LEVEL_FONT = `12.25px Proxima Nova`;
const DEFAULT_OPACITY = 1;
const STEP_OPACITY = 0.05;
const START_ANIMATED_OPACITY = 0.5;
const UPDATE_ANIMATION_INTERVAL = 50;

const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

const getCellType = (type: string) =>
  type === OrderBookCellType.Depth
    ? OrderBookCellType.Depth
    : OrderBookCellType.Volume;

const getY = (side: Side, idx: number, levelHeight: number) =>
  (side === Side.Buy ? idx : LEVELS_COUNT - idx - 1) * levelHeight;

const updateAnimatingLevelsWithNewLevel = (
  arr: IAnimatingLevels[],
  price: number
): IAnimatingLevels[] => {
  const levelForAnimation: IAnimatingLevels = {
    price,
    currentOpacity: START_ANIMATED_OPACITY,
    isAnimated: false
  };
  return [...arr, levelForAnimation];
};

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
  setSpanUpdatingHandler: (t: LevelType, fn: () => void) => void;
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

interface IAnimatingLevels {
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
        if (!!this.animatingLevels.length) {
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

  drawLevels = (asks: Order[] = [], bids: Order[] = [], type: LevelType) => {
    this.levelsCells = [];
    const {displayType, instrument, format, width, height} = this.props;

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

    const isAnimationPrevented = !this.cachedLevels.length;

    levels.forEach((l, i: number) => {
      const existedLevel = this.cachedLevels.find(ml => ml.price === l.price);
      const color = fillBySide(l.side);

      let volumeColor = colors.white;
      let volumeOpacity = DEFAULT_OPACITY;

      if (!isAnimationPrevented) {
        if (!existedLevel || existedLevel[displayType] !== l[displayType]) {
          this.animatingLevels = updateAnimatingLevelsWithNewLevel(
            this.animatingLevels,
            l.price
          );
        }

        const animatingLevel = this.animatingLevels.find(
          al => al.price === l.price
        );

        if (animatingLevel) {
          if (animatingLevel.currentOpacity < DEFAULT_OPACITY) {
            animatingLevel.currentOpacity += STEP_OPACITY;
          } else {
            animatingLevel.isAnimated = true;
          }
          volumeColor = animatingLevel.isAnimated ? colors.white : color;
          volumeOpacity = animatingLevel.currentOpacity;
        }
      }

      const y = getY(l.side, i, levelHeight);
      const canvasY = getY(
        l.side,
        l.side === Side.Sell ? i - 1 : i + 1,
        levelHeight
      );

      const value = format(
        l[displayType] * l.price,
        instrument.quoteAsset.accuracy
      );

      drawRect({
        ctx: this.canvasCtx,
        color,
        x: width / 3,
        y,
        width: normalize(l[displayType]),
        height: levelHeight,
        opacity: 0.16
      });

      if (l.connectedLimitOrders.length > 0) {
        drawVerticalLine({
          ctx: this.canvasCtx,
          x: width / 3 + 1,
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
        text: format(l.price, this.props.spanAccuracy),
        x: LEFT_PADDING,
        y: canvasY - TOP_PADDING,
        font: LEVEL_FONT,
        align: 'start'
      });
      this.levelsCells.push({
        left: LEFT_PADDING,
        top: y,
        width: width / 3 - LEFT_PADDING,
        height: levelHeight,
        type: OrderBookCellType.Price,
        value: l.price,
        side: l.side
      });

      const volume = format(l[displayType], instrument.baseAsset.accuracy);

      if (hasTrailingZeroes(volume)) {
        let drownSymbolsWidth = 0;
        const trailingZeroPosition = getTrailingZeroStartPosition(volume);

        volume.split('').forEach((symbol: string, index: number) => {
          const symbolColor =
            index < trailingZeroPosition ? volumeColor : colors.coolGrey;
          drawText({
            ctx: this.canvasCtx,
            color: symbolColor,
            text: symbol,
            x: width / 3 + LEFT_PADDING + drownSymbolsWidth,
            y: canvasY - TOP_PADDING,
            font: LEVEL_FONT,
            align: 'start',
            opacity: volumeOpacity
          });
          drownSymbolsWidth += this.canvasCtx!.measureText(symbol).width;
        });
      } else {
        drawText({
          ctx: this.canvasCtx,
          color: volumeColor,
          text: volume,
          x: width / 3 + LEFT_PADDING,
          y: canvasY - TOP_PADDING,
          font: LEVEL_FONT,
          align: 'start',
          opacity: volumeOpacity
        });
      }

      this.levelsCells.push({
        left: width / 3,
        top: y,
        width: width / 3,
        height: levelHeight,
        type: getCellType(displayType),
        value: l.depth,
        side: l.side
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
    });
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
    this.drawLevels(asks, bids, type);
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
            width={width / 3 * 2}
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
