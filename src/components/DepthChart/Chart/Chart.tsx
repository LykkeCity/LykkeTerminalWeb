import * as React from 'react';

import {DepthArea, DepthText, Order} from '../../../models';
import chart from './chartConstants';

import {defineCanvasScale} from '../../../utils/canvasUtils';
import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import {colors} from '../../styled';
import {
  COST_PADDING,
  DEPTH_PADDING,
  drawChartElements,
  getAreaColor,
  getPopupCoords,
  IDrawTools,
  measureText,
  PRICE_PADDING,
  VALUE_PADDING
} from './chartHelpers';

const PRICE_FONT_SIZE = 14;
const FONT_SIZE = 13;

interface ChartProps {
  asks: Order[];
  bids: Order[];
  width: number;
  height: number;
  canvasHeight: number;
  canvasWidth: number;
  quoteAccuracy: number;
  baseAccuracy: number;
  priceAccuracy: number;
  baseAssetName: string;
  quoteAssetName: string;
}

class Chart extends React.Component<ChartProps> {
  graphics: any[] = [];
  pointsAsks: any[] = [];
  pointsBids: any[] = [];

  midXAsks: number;
  midXBids: number;

  asksWidth: number;

  minDepth: number;
  maxDepth: number;

  asksStart: number;
  asksEnd: number;
  bidsStart: number;
  bidsEnd: number;

  coefficient: number;

  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  memoWidth: number = 0;
  xIndex: number = -1;
  currentArea: DepthArea;
  drawTools: IDrawTools;

  constructor(props: ChartProps) {
    super(props);
  }

  componentDidMount() {
    this.canvasCtx = this.canvas!.getContext('2d');
    window.requestAnimationFrame(() => {
      this.renderCanvas();
      this.forceUpdate();
    });

    defineCanvasScale(
      this.canvasCtx,
      this.canvas,
      this.props.canvasWidth,
      this.props.canvasHeight
    );

    this.canvas!.addEventListener('mouseleave', (event: any) => {
      window.requestAnimationFrame(() => {
        this.renderCanvas();
        this.forceUpdate();
      });
    });

    this.canvas!.addEventListener('mousemove', (event: any) => {
      const {offsetX: x} = event;
      this.currentArea = this.getCurrentArea(x);
      let point: {x: number; y: number};
      if (this.currentArea === DepthArea.Bid) {
        point = this.findPoints(this.pointsBids)(x)!;
      } else {
        point = this.findPoints(this.pointsAsks)(x)!;
      }

      if (point) {
        window.requestAnimationFrame(() => {
          this.renderCanvas(point.y, x);
          this.forceUpdate();
        });
      }
    });

    this.drawTools = drawChartElements(this.canvasCtx!, () => this.currentArea);
  }

  componentWillReceiveProps({canvasWidth}: ChartProps) {
    window.requestAnimationFrame(() => {
      if (canvasWidth !== this.memoWidth) {
        this.memoWidth = canvasWidth;
        defineCanvasScale(
          this.canvasCtx,
          this.canvas,
          this.props.canvasWidth,
          this.props.canvasHeight
        );
      }
      this.renderCanvas();
      this.forceUpdate();
    });
  }

  findPoints = (points: Array<{x: number; y: number}>) => (x: number) => {
    const xPoints = points.map(p => p.x);
    xPoints.push(x);
    xPoints.sort((a, b) => a - b);
    const xIndex = xPoints.findIndex(i => i === x);
    const sibling =
      this.currentArea === DepthArea.Bid ? xIndex - 1 : xIndex + 1;
    this.xIndex = sibling;
    return points.find(p => p.x === xPoints[sibling]);
  };

  getCurrentArea = (x: number) =>
    x > this.midXBids ? DepthArea.Ask : DepthArea.Bid;

  calculateAsksStepLength(ask: Order, index: number) {
    const priceDifference = this.props.asks[index + 1]
      ? this.props.asks[index + 1].price - this.asksStart
      : this.props.asks[index].price - this.asksStart;
    const priceRange = this.asksEnd - this.asksStart;
    const length = this.asksWidth * priceDifference / priceRange;
    return isNaN(length) ? this.asksWidth : length;
  }

  calculateAsksStepHeight(ask: Order) {
    return this.coefficient * ask.depth;
  }

  generateAsksPoints = () => {
    let currentX = this.midXAsks;
    let newX = this.midXAsks;
    let newY = this.props.height;
    const points = [{x: this.midXAsks, y: this.props.height}];

    for (let index = 0; index < this.props.asks.length; index++) {
      newX =
        this.midXAsks +
        this.calculateAsksStepLength(this.props.asks[index], index);
      newY =
        this.props.height -
        this.calculateAsksStepHeight(this.props.asks[index]);
      points.push({x: currentX, y: newY}, {x: newX, y: newY});
      currentX = newX;
    }
    this.pointsAsks = points;
  };

  drawAsks = () => {
    this.generateAsksPoints();
    const points: any = this.pointsAsks.map((p: any) => ({
      ...p,
      color: chart.asks.lineColor
    }));
    points.push(
      {
        x: this.props.width,
        y: this.props.height
      },
      {
        x: this.midXBids,
        y: this.props.height
      }
    );

    this.drawTools.drawLevel(points);
  };

  calculateBidsStepLength(bid: Order, index: number) {
    const priceDifference = this.props.bids[index + 1]
      ? this.bidsStart - this.props.bids[index + 1].price
      : this.bidsStart - this.props.bids[index].price;
    const priceRange = this.bidsStart - this.bidsEnd;
    const length = this.midXBids * priceDifference / priceRange;
    return isNaN(length) ? this.midXBids : length;
  }

  calculateBidsStepHeight(bid: Order) {
    return this.coefficient * bid.depth;
  }

  generateBidsPoints = () => {
    let currentX = this.midXBids;
    let newX = this.midXBids;
    let newY = this.props.height;
    const points = [{x: this.midXBids, y: this.props.height}];

    for (let index = 0; index < this.props.bids.length; index++) {
      newX =
        this.midXBids -
        this.calculateBidsStepLength(this.props.bids[index], index);
      newY =
        this.props.height -
        this.calculateBidsStepHeight(this.props.bids[index]);
      points.push({x: currentX, y: newY}, {x: newX, y: newY});
      currentX = newX;
    }
    this.pointsBids = points;
  };

  drawBids = () => {
    this.generateBidsPoints();
    const points: any = this.pointsBids.map((p: any) => ({
      ...p,
      color: chart.bids.lineColor
    }));
    points.push(
      {
        x: 0,
        y: this.props.height
      },
      {
        x: this.midXBids,
        y: this.props.height
      }
    );

    this.drawTools.drawLevel(points);
  };

  drawPopup = (y: number, x: number) => {
    this.drawTools.drawPointer(x, y);
    this.drawTools.drawPointerLine(this.props.height, x, y);

    const order = this.findOrder();
    if (order) {
      const depthLabel = this.getDepthText();

      const priceValue = `${formattedNumber(
        order.price,
        this.props.priceAccuracy
      )} ${this.props.quoteAssetName}`;
      const depthValue = `${formattedNumber(
        order.depth,
        this.props.baseAccuracy
      )} ${this.props.baseAssetName}`;

      const costValue = `${formattedNumber(
        this.calculateExactPrice(),
        this.props.quoteAccuracy
      )} ${this.props.quoteAssetName}`;

      const priceMeasure = measureText(
        priceValue,
        PRICE_FONT_SIZE,
        chart.modal.label.fontFamily
      );
      const depthMeasure = measureText(
        `${depthLabel} ${depthValue}`,
        FONT_SIZE,
        chart.modal.label.fontFamily
      );
      const depthLabelMeasure = measureText(
        depthLabel,
        FONT_SIZE,
        chart.modal.label.fontFamily
      );
      const costMeasure = measureText(
        `${DepthText.Cost} ${costValue}`,
        FONT_SIZE,
        chart.modal.label.fontFamily
      );
      const costLabelMeasure = measureText(
        DepthText.Cost,
        FONT_SIZE,
        chart.modal.label.fontFamily
      );
      const maxValueWidth = Math.max(priceMeasure, depthMeasure, costMeasure);

      this.drawTools.drawPopup(
        getPopupCoords(x, y, maxValueWidth, this.currentArea, this.midXBids)
      );

      const drawText = this.drawTools.drawText(
        x,
        y,
        this.currentArea,
        this.midXBids,
        maxValueWidth
      );

      // draw price
      drawText(
        priceMeasure,
        priceValue,
        colors.white,
        PRICE_FONT_SIZE,
        PRICE_PADDING
      );

      // draw depth label
      drawText(
        depthLabelMeasure,
        depthLabel,
        getAreaColor(this.currentArea),
        FONT_SIZE,
        DEPTH_PADDING
      );

      // draw depth value
      drawText(
        depthMeasure,
        depthValue,
        colors.white,
        FONT_SIZE,
        DEPTH_PADDING,
        depthLabelMeasure + VALUE_PADDING
      );

      // draw cost label
      drawText(
        costLabelMeasure,
        DepthText.Cost,
        getAreaColor(this.currentArea),
        FONT_SIZE,
        COST_PADDING
      );

      // draw cost value
      drawText(
        costMeasure,
        costValue,
        colors.white,
        FONT_SIZE,
        COST_PADDING,
        costLabelMeasure + VALUE_PADDING
      );
    }
  };

  calculateCoefficient() {
    if (this.minDepth && this.maxDepth) {
      if (this.minDepth === this.maxDepth) {
        return this.props.height / this.minDepth * chart.scaleFactor;
      }
      return this.props.height / this.maxDepth * chart.scaleFactor;
    }
    return 1;
  }

  initilaize() {
    this.graphics = [];
    this.midXAsks = this.props.width / 2 + Math.round(chart.strokeWidth / 2);
    this.midXBids = this.props.width / 2 - Math.round(chart.strokeWidth / 2);
    this.asksWidth = this.props.width - this.midXAsks;
    this.minDepth = Math.min(
      ...this.props.bids.concat(this.props.asks).map(x => x.depth)
    );
    this.maxDepth = Math.max(
      ...this.props.bids.concat(this.props.asks).map(x => x.depth)
    );
    this.asksStart = Math.min(...this.props.asks.map(a => a.price));
    this.asksEnd = Math.max(...this.props.asks.map(a => a.price));
    this.bidsStart = Math.max(...this.props.bids.map(b => b.price));
    this.bidsEnd = Math.min(...this.props.bids.map(b => b.price));
    this.coefficient = this.calculateCoefficient();
  }

  renderCanvas = (y?: number, x?: number) => {
    if (this.canvas) {
      this.canvasCtx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.drawAsks();
    this.drawBids();

    if (y && x) {
      this.drawPopup(y, x);
    }
  };

  calculateExactPrice = (): number => {
    const orders =
      this.currentArea === DepthArea.Bid ? this.props.bids : this.props.asks;
    let exactPrice = 0;

    if (this.currentArea === DepthArea.Bid) {
      for (let i = 0; i < orders.length - Math.floor(this.xIndex / 2); i++) {
        const price = orders[i].price;
        const volume = orders[i].volume;

        exactPrice += price * volume;
      }
    } else {
      for (let i = 0; i < this.xIndex / 2 - 1; i++) {
        const price = orders[i].price;
        const volume = orders[i].volume;

        exactPrice += price * volume;
      }
    }

    return exactPrice;
  };

  getDepthText = () =>
    this.currentArea === DepthArea.Bid
      ? DepthText.CanBeSold
      : DepthText.CanBeBought;

  findOrder = () => {
    if (this.currentArea === DepthArea.Bid) {
      return [...this.props.bids].reverse()[Math.floor(this.xIndex / 2)];
    }
    return this.props.asks[Math.floor(this.xIndex / 2) - 1];
  };

  setCanvasRef = (canvas: any) => (this.canvas = canvas);

  render() {
    this.initilaize();

    return (
      <React.Fragment>
        <canvas
          width={this.props.canvasWidth}
          height={this.props.canvasHeight}
          ref={this.setCanvasRef}
        />
      </React.Fragment>
    );
  }
}

export default Chart;
