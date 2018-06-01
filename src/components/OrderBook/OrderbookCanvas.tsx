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

const LEVELS_FONT = '12.25px Proxima Nova';

const fillBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

export interface LevelListProps {
  levels: Order[];
  instrument: InstrumentModel;
  format: (num: number, accuracy: number) => string;
  normalize: (num: number) => number;
  height: number;
  width: number;
  handleOrderBookClick: (x: number, y: number) => void;
  storeLevelCellInfo: (level: void) => any;
  isReadOnly: boolean;
  getAsks: any;
  getBids: any;
  displayType: string;
  getLevels: () => Order[];
  handleDrawLevels: any;
  levelsType: string;
}

class OrderBookCanvas extends React.Component<LevelListProps> {
  levelsCanvas: any;
  levelsCtx: any;
  levelsElements: any[] = [];
  canvasHeight: number = 0;

  handleDrawLevels = () => {
    window.requestAnimationFrame(() => {
      this.renderCanvas();
      this.forceUpdate();
    });
  };

  componentDidMount() {
    // const runLoop = () => {
    //   this.renderCanvas();
    //   this.forceUpdate();
    //   window.requestAnimationFrame(runLoop);
    // };
    //
    // window.requestAnimationFrame(runLoop);
    this.props.handleDrawLevels(this.handleDrawLevels);

    this.levelsCanvas = ReactDOM.findDOMNode(this);
    this.levelsCtx = this.levelsCanvas.getContext('2d');

    this.levelsCanvas.addEventListener(
      'click',
      (event: any) => {
        const x = event.layerX;
        const y = event.layerY;

        const clickedLevelElement = this.levelsElements.find(
          (el: any) =>
            y > el.top &&
            y < el.top + el.height &&
            x > el.left &&
            x < el.left + el.width
        );

        // tslint:disable:no-console
        console.log(
          `type: ${clickedLevelElement.type} value: ${
            clickedLevelElement.value
          }`
        );
      },
      false
    );

    defineCanvasScale(this.levelsCtx);

    this.renderCanvas();
  }

  renderMyCanvas() {
    this.levelsElements = [];
    const {
      getAsks,
      getBids,
      displayType,
      instrument,
      format,
      width
    } = this.props;

    const asks = getAsks();
    const bids = getBids();
    const levels = this.props.levelsType === 'ask' ? asks : bids;
    this.canvasHeight = levels.length;

    const vals = map(prop(toLower(displayType)), [
      ...asks,
      ...bids
    ]) as number[];
    const normalize = curry(normalizeVolume)(
      Math.min(...vals),
      Math.max(...vals)
    );

    levels.forEach((l: any, i: number) => {
      const value = format(
        l[displayType] * l.price,
        instrument.quoteAsset.accuracy
      );

      drawRect({
        ctx: this.levelsCtx,
        color: fillBySide(l.side),
        x: width / 3,
        y: (i + 1) * LEVEL_HEIGHT,
        width: normalize(l[displayType]),
        height: LEVEL_HEIGHT,
        opacity: 0.16
      });
      drawLine({
        ctx: this.levelsCtx,
        width,
        y: (i + 1) * LEVEL_HEIGHT,
        x: LEFT_PADDING,
        color: colors.graphiteBorder,
        lineWidth: 1
      });
      drawText({
        ctx: this.levelsCtx,
        color: fillBySide(l.side),
        text: format(l.price, instrument.accuracy),
        x: LEFT_PADDING,
        y: (i + 1) * LEVEL_HEIGHT - TOP_PADDING,
        font: LEVELS_FONT,
        align: 'start'
      });
      this.levelsElements.push({
        left: LEFT_PADDING,
        top: i * LEVEL_HEIGHT,
        width: width / 3,
        height: LEVEL_HEIGHT,
        type: 'price',
        value: l.price
      });

      drawText({
        ctx: this.levelsCtx,
        color: fillBySide(l.side),
        text: format(l[displayType], instrument.baseAsset.accuracy),
        x: width / 3 + LEFT_PADDING,
        y: (i + 1) * LEVEL_HEIGHT - TOP_PADDING,
        font: LEVELS_FONT,
        align: 'start'
      });
      this.levelsElements.push({
        left: width / 3 + LEFT_PADDING,
        top: i * LEVEL_HEIGHT,
        width: width / 3,
        height: LEVEL_HEIGHT,
        type: displayType,
        value: l.depth
      });

      drawText({
        ctx: this.levelsCtx,
        color: '#fff',
        text: value,
        x: width,
        y: (i + 1) * LEVEL_HEIGHT - TOP_PADDING,
        font: LEVELS_FONT,
        align: 'end'
      });
    });
  }

  renderCanvas() {
    this.levelsCtx.clearRect(
      0,
      0,
      this.props.width,
      this.canvasHeight * LEVEL_HEIGHT
    );
    this.renderMyCanvas();
  }

  render() {
    return (
      <canvas
        width={this.props.width}
        height={this.canvasHeight * LEVEL_HEIGHT}
      />
    );
  }
}

export default OrderBookCanvas;
