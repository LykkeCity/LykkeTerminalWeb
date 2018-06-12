import * as React from 'react';
import ReactDOM from 'react-dom';

import {colors} from '../styled';

import {InstrumentModel, Order, Side} from '../../models';
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
import {FakeOrderBookStage} from './styles';

const LEVEL_FONT = `12.25px Proxima Nova`;

const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

const getCellType = (type: string) =>
  type === OrderBookCellType.Depth
    ? OrderBookCellType.Depth
    : OrderBookCellType.Volume;

const getY = (side: Side, idx: number, levelHeight: number) =>
  (side === Side.Buy ? idx : LEVELS_COUNT - idx - 1) * levelHeight;

export interface LevelListProps {
  levels: Order[];
  instrument: InstrumentModel;
  format: (num: number, accuracy: number) => string;
  normalize: (num: number) => number;
  height: number;
  width: number;
  isReadOnly: boolean;
  getAsks: any;
  getBids: any;
  displayType: string;
  getLevels: () => Order[];
  setLevelsUpdatingHandler: (
    fn: (asks: Order[], bids: Order[], type: LevelType) => void
  ) => void;
  triggerOrderUpdate: (clickedEl: any) => void;
  type: LevelType;
}

class LevelList extends React.Component<LevelListProps> {
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  levelsCells: any[] = [];
  fakeStage: any;
  memoWidth: number = 0;

  handleLevelsUpdating = (asks: Order[], bids: Order[], type: LevelType) => {
    window.requestAnimationFrame(() => {
      this.renderCanvas(asks, bids, type);
      this.forceUpdate();
    });
  };

  togglePointerEvents = (value: string) =>
    ((ReactDOM.findDOMNode(this.fakeStage) as HTMLDivElement).style[
      'pointer-events'
    ] = value);

  componentDidMount() {
    const {setLevelsUpdatingHandler} = this.props;
    setLevelsUpdatingHandler(this.handleLevelsUpdating);
    this.canvasCtx = this.canvas!.getContext('2d');
    this.canvas!.addEventListener(
      'mouseup',
      (event: any) => {
        const x = event.layerX;
        const y = event.layerY;

        const clickedLevelElement = this.levelsCells.find(
          (el: any) =>
            y > el.top &&
            y < el.top + el.height &&
            x > el.left &&
            x < el.left + el.width
        );

        if (clickedLevelElement) {
          this.props.triggerOrderUpdate(clickedLevelElement);
        }
        this.togglePointerEvents('auto');
      },
      false
    );

    defineCanvasScale(
      this.canvasCtx,
      this.canvas,
      this.props.width,
      this.props.height
    );
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

    levels.forEach((l, i: number) => {
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
      const color = fillBySide(l.side);

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
        text: format(l.price, instrument.accuracy),
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

      drawText({
        ctx: this.canvasCtx,
        color,
        text: format(l[displayType], instrument.baseAsset.accuracy),
        x: width / 3 + LEFT_PADDING,
        y: canvasY - TOP_PADDING,
        font: LEVEL_FONT,
        align: 'start'
      });
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
  };

  componentWillReceiveProps({width}: any) {
    window.requestAnimationFrame(() => {
      if (width !== this.memoWidth) {
        this.memoWidth = width;
        defineCanvasScale(
          this.canvasCtx,
          this.canvas,
          width,
          this.props.height
        );
      }
      this.renderCanvas(
        this.props.getAsks(),
        this.props.getBids(),
        this.props.type
      );
      this.forceUpdate();
    });
  }

  renderCanvas = (asks: Order[], bids: Order[], type: LevelType) => {
    if (this.canvas) {
      this.canvasCtx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.drawLevels(asks, bids, type);
  };

  setFakeStageRef = (div: any) => (this.fakeStage = div);
  setCanvasRef = (canvas: any) => (this.canvas = canvas);
  handleMouseDownOnFakeStage = () => this.togglePointerEvents('none');

  render() {
    return (
      <React.Fragment>
        {!this.props.isReadOnly && (
          <FakeOrderBookStage
            width={this.props.width / 3 * 2}
            height={this.props.height}
            onMouseDown={this.handleMouseDownOnFakeStage}
            ref={this.setFakeStageRef}
          />
        )}
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={this.setCanvasRef}
        />
      </React.Fragment>
    );
  }
}

export default LevelList;
