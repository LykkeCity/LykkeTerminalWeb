import * as React from 'react';
import ReactDOM from 'react-dom';

import {colors} from '../styled';

import {InstrumentModel, Order, Side} from '../../models';
import {LEFT_PADDING, LEVEL_HEIGHT, TOP_PADDING} from './index';

import {curry, map, prop, toLower} from 'rambda';
import {normalizeVolume} from '../../utils';
import {
  defineCanvasScale,
  drawLine,
  drawRect,
  drawText
} from '../../utils/canvasUtils';

import LevelType from '../../models/levelType';
import OrderBookCellType from '../../models/orderBookCellType';
import {FakeOrderBookStage} from './styles';

const LEVELS_FONT = '12.25px Proxima Nova';

const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

const getCellType = (type: string) =>
  type === OrderBookCellType.Depth
    ? OrderBookCellType.Depth
    : OrderBookCellType.Volume;

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
  setLevelsDrawingHandler: (
    fn: (asks: Order[], bids: Order[], type: LevelType) => void
  ) => void;
  triggerOrderUpdate: (clickedEl: any) => void;
  type: LevelType;
}

class LevelList extends React.Component<LevelListProps> {
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  levelsCells: any[] = [];
  canvasHeight: number = 0;
  fakeStage: any;

  handleLevelsDrawing = (asks: Order[], bids: Order[], type: LevelType) => {
    // window.requestAnimationFrame(() => {
    //   this.renderCanvas(asks, bids, type);
    //   this.forceUpdate();
    // });
  };

  togglePointerEvents = (value: string) =>
    ((ReactDOM.findDOMNode(this.fakeStage) as HTMLDivElement).style[
      'pointer-events'
    ] = value);

  componentDidMount() {
    const runLoop = () => {
      this.renderCanvas(
        this.props.getAsks(),
        this.props.getBids(),
        this.props.type
      );
      this.forceUpdate();
      window.requestAnimationFrame(runLoop);
    };
    window.requestAnimationFrame(runLoop);

    const {setLevelsDrawingHandler} = this.props;
    setLevelsDrawingHandler(this.handleLevelsDrawing);
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

    defineCanvasScale(this.canvasCtx);
  }

  drawLevels = (asks: Order[], bids: Order[], type: LevelType) => {
    this.levelsCells = [];
    const {displayType, instrument, format, width} = this.props;

    const levels = type === LevelType.Asks ? asks : bids;
    this.canvasHeight = levels.length;

    const vals = map(prop(toLower(displayType)), [
      ...asks,
      ...bids
    ]) as number[];
    const normalize = curry(normalizeVolume)(
      Math.min(...vals),
      Math.max(...vals)
    );

    levels.forEach((l, i: number) => {
      const value = format(
        l[displayType] * l.price,
        instrument.quoteAsset.accuracy
      );

      drawRect({
        ctx: this.canvasCtx,
        color: fillBySide(l.side),
        x: width / 3,
        y: (i + 1) * LEVEL_HEIGHT,
        width: normalize(l[displayType]),
        height: LEVEL_HEIGHT,
        opacity: 0.16
      });
      drawLine({
        ctx: this.canvasCtx,
        width,
        y: (i + 1) * LEVEL_HEIGHT,
        x: LEFT_PADDING,
        color: colors.graphiteBorder,
        lineWidth: 1
      });

      drawText({
        ctx: this.canvasCtx,
        color: fillBySide(l.side),
        text: format(l.price, instrument.accuracy),
        x: LEFT_PADDING,
        y: (i + 1) * LEVEL_HEIGHT - TOP_PADDING,
        font: LEVELS_FONT,
        align: 'start'
      });
      this.levelsCells.push({
        left: LEFT_PADDING,
        top: i * LEVEL_HEIGHT,
        width: width / 3,
        height: LEVEL_HEIGHT,
        type: OrderBookCellType.Price,
        value: l.price,
        side: l.side
      });

      drawText({
        ctx: this.canvasCtx,
        color: fillBySide(l.side),
        text: format(l[displayType], instrument.baseAsset.accuracy),
        x: width / 3 + LEFT_PADDING,
        y: (i + 1) * LEVEL_HEIGHT - TOP_PADDING,
        font: LEVELS_FONT,
        align: 'start'
      });
      this.levelsCells.push({
        left: width / 3 + LEFT_PADDING,
        top: i * LEVEL_HEIGHT,
        width: width / 3,
        height: LEVEL_HEIGHT,
        type: getCellType(displayType),
        value: l.depth,
        side: l.side
      });

      drawText({
        ctx: this.canvasCtx,
        color: colors.white,
        text: value,
        x: width,
        y: (i + 1) * LEVEL_HEIGHT - TOP_PADDING,
        font: LEVELS_FONT,
        align: 'end'
      });
    });
  };

  renderCanvas = (asks: Order[], bids: Order[], type: LevelType) => {
    this.canvasCtx!.clearRect(
      0,
      0,
      this.props.width,
      this.canvasHeight * LEVEL_HEIGHT
    );
    this.drawLevels(asks, bids, type);
  };

  render() {
    return (
      <React.Fragment>
        {!this.props.isReadOnly && (
          <FakeOrderBookStage
            width={this.props.width / 3 * 2}
            height={this.canvasHeight * LEVEL_HEIGHT}
            // tslint:disable-next-line:jsx-no-lambda
            onMouseDown={() => this.togglePointerEvents('none')}
            ref={(div: any) => (this.fakeStage = div)}
          />
        )}
        <canvas
          width={this.props.width}
          height={this.canvasHeight * LEVEL_HEIGHT}
          ref={(canvas: any) => (this.canvas = canvas)}
        />
      </React.Fragment>
    );
  }
}

export default LevelList;
