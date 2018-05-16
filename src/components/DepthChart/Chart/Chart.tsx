import * as React from 'react';

import {Line} from 'react-konva';

import {Order} from '../../../models';

import {Pointer} from './index';

import {reverse} from 'rambda';
import chart from './chartConstants';

interface ChartProps {
  asks: Order[];
  bids: Order[];
  mid: number;
  width: number;
  height: number;
  quoteAccuracy: number;
  baseAccuracy: number;
  priceAccuracy: number;
}

class Chart extends React.Component<ChartProps> {
  graphics: any[] = [];
  pointsAsks: number[] = [];
  pointsBids: number[] = [];

  width: number = -1;
  height: number = -1;

  asks: Order[];
  bids: Order[];
  mid: number;

  midXAsks: number;
  midXBids: number;
  midY: number;

  minDepth: number;
  maxDepth: number;

  coef: number;

  constructor(props: ChartProps) {
    super(props);
  }

  calculateAsksStepLength(ask: Order, index: number) {
    ask.price === 0 ? (ask.price = 1) : (ask.price = ask.price);
    const prevPrice = this.asks[index - 1]
      ? this.asks[index - 1].price
      : this.mid;
    const length =
      (Math.log10(ask.price) - Math.log10(prevPrice)) *
      this.midXAsks /
      (Math.log10(this.asks[this.asks.length - 1].price) -
        Math.log10(this.mid));
    return length;
  }

  calculateAsksStepHeight(ask: Order) {
    return this.coef * ask.depth;
  }

  generateAsksPoints = () => {
    let currentX = this.midXAsks;
    let newX = this.midXAsks;
    let newY = this.midY;
    const points = [currentX, this.midY];

    for (let index = 0; index < this.asks.length; index++) {
      const length = this.calculateAsksStepLength(this.asks[index], index);
      if (length > 0) {
        newX = currentX + length;
        newY = this.midY - this.calculateAsksStepHeight(this.asks[index]);
        points.push(currentX, newY, newX, newY);

        currentX = newX;
      } else {
        return;
      }
    }
    this.pointsAsks = points;
  };

  drawAsks = () => {
    this.generateAsksPoints();

    this.graphics.push(
      <Line
        key="asks-line"
        points={this.pointsAsks}
        closed={false}
        stroke={chart.asks.lineColor}
        strokeWidth={chart.strokeWidth}
        dashEnabled={false}
        shadowEnabled={false}
        listening={false}
      />
    );
    this.graphics.push(
      <Line
        key="asks-area"
        points={this.pointsAsks.concat([
          this.width,
          this.height,
          this.midXBids,
          this.height
        ])}
        closed={true}
        fill={chart.asks.fillColor}
        strokeEnabled={false}
        dashEnabled={false}
        shadowEnabled={false}
        listening={false}
      />
    );
  };

  drawAsksPointerPadding = () => {
    this.graphics.push(
      <Pointer
        key="asks-pointer"
        side={'asks'}
        color={chart.asks.lineColor}
        orders={this.asks}
        points={this.pointsAsks}
        borders={[this.midXAsks, this.midY, this.width, 0]}
      />
    );
  };

  calculateBidsStepLength(bid: Order, index: number) {
    bid.price === 0 ? (bid.price = 1) : (bid.price = bid.price);
    const prevPrice = this.bids[index - 1]
      ? this.bids[index - 1].price
      : this.mid;
    const length =
      (Math.log10(bid.price) - Math.log10(prevPrice)) *
      this.midXBids /
      (Math.log10(
        this.bids[this.bids.length - 1].price === 0
          ? 1
          : this.bids[this.bids.length - 1].price
      ) -
        Math.log10(this.mid));
    return length;
  }

  calculateBidsStepHeight(bid: Order) {
    return this.coef * bid.depth;
  }

  generateBidsPoints = () => {
    let currentX = this.midXBids;
    let newX = this.midXBids;
    let newY = this.midY;
    const points = [currentX, this.midY];

    for (let index = 0; index < this.bids.length; index++) {
      const length = this.calculateBidsStepLength(this.bids[index], index);
      if (length > 0) {
        newX = currentX - length;
        newY = this.midY - this.calculateBidsStepHeight(this.bids[index]);

        points.push(currentX, newY, newX, newY);

        currentX = newX;
      } else {
        return;
      }
    }
    this.pointsBids = points;
  };

  drawBids = () => {
    this.generateBidsPoints();

    this.graphics.push(
      <Line
        key="bids-line"
        points={this.pointsBids}
        closed={false}
        stroke={chart.bids.lineColor}
        strokeWidth={chart.strokeWidth}
        dashEnabled={false}
        shadowEnabled={false}
        strokeHitEnabled={false}
        listening={false}
      />
    );
    this.graphics.push(
      <Line
        key="bids-area"
        points={this.pointsBids.concat([
          0,
          this.midY,
          this.midXBids,
          this.midY
        ])}
        closed={true}
        fill={chart.bids.fillColor}
        strokeEnabled={false}
        dashEnabled={false}
        shadowEnabled={false}
        strokeHitEnabled={false}
        listening={false}
      />
    );
  };

  drawBidsPointerPadding = () => {
    this.graphics.push(
      <Pointer
        key="bids-pointer"
        side={'bids'}
        color={chart.bids.lineColor}
        orders={this.bids}
        points={this.pointsBids}
        borders={[0, this.midY, this.midXBids, 0]}
      />
    );
  };

  calculateCoef() {
    if (this.minDepth && this.maxDepth) {
      if (this.minDepth === this.maxDepth) {
        return this.height / this.minDepth * chart.scaleFactor;
      }
      return this.height / this.maxDepth * chart.scaleFactor;
    }
    return 1;
  }

  initilaize() {
    this.graphics = [];
    this.width = this.props.width;
    this.height = this.props.height;
    this.midXAsks = this.props.width / 2 + Math.round(chart.strokeWidth / 2);
    this.midXBids = this.props.width / 2 - Math.round(chart.strokeWidth / 2);
    this.midY = this.height;
    this.asks = reverse(this.props.asks);
    this.bids = this.props.bids;
    this.mid = this.props.mid;
    this.minDepth = Math.min(...this.bids.concat(this.asks).map(x => x.depth));
    this.maxDepth = Math.max(...this.bids.concat(this.asks).map(x => x.depth));
    this.coef = this.calculateCoef();
  }

  render() {
    this.initilaize();

    this.drawAsks();
    this.drawBids();

    if (this.asks.length > 0) {
      this.drawAsksPointerPadding();
    }
    if (this.bids.length > 0) {
      this.drawBidsPointerPadding();
    }

    return this.graphics;
  }
}

export default Chart;
