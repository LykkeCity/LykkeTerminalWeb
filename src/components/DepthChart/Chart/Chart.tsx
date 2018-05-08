import * as React from 'react';

import {Line} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';
import Pointer from './Pointer';

import chart from './chartConstants';

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
    return (
      (Math.log10(ask.price) - Math.log10(prevPrice)) *
      this.midXAsks /
      (Math.log10(this.asks[this.asks.length - 1].price) - Math.log10(this.mid))
    );
  }

  calculateAsksStepHeight(ask: Order) {
    return this.coef * ask.depth;
  }

  generateAsksPoints = () => {
    let currentX = this.midXAsks;
    let currentY = this.midY;
    let newX = this.midXAsks;
    let newY = this.midY;
    const points = [currentX, currentY];

    this.asks.forEach((ask, index) => {
      newX = currentX + this.calculateAsksStepLength(ask, index);
      newY = this.midY - this.calculateAsksStepHeight(ask);

      points.push(currentX, newY, newX, newY);

      currentX = newX;
      currentY = newY;
    });

    this.pointsAsks = points;
  };

  drawAsks = () => {
    this.generateAsksPoints();

    this.graphics.push(
      <Line
        points={this.pointsAsks}
        closed={false}
        stroke={chart.asks.lineColor}
        strokeWidth={chart.strokeWidth}
      />
    );
    this.graphics.push(
      <Line
        points={this.pointsAsks.concat([this.width, this.height])}
        closed={true}
        fill={chart.asks.fillColor}
      />
    );
  };

  drawAsksPointerPadding = () => {
    this.graphics.push(
      <Pointer
        baseAsset={this.props.baseAsset}
        quoteAsset={this.props.quoteAsset}
        orders={this.asks}
        side={'asks'}
        points={this.pointsAsks}
        borders={[this.midXAsks, this.midY, this.width, 0]}
        color={chart.asks.lineColor}
        width={this.props.width}
        height={this.props.height}
        quoteAccuracy={this.props.quoteAccuracy}
        baseAccuracy={this.props.baseAccuracy}
        priceAccuracy={this.props.priceAccuracy}
      />
    );
  };

  calculateBidsStepLength(bid: Order, index: number) {
    bid.price === 0 ? (bid.price = 1) : (bid.price = bid.price);
    const prevPrice = this.bids[index - 1]
      ? this.bids[index - 1].price
      : this.mid;
    return (
      (Math.log10(bid.price) - Math.log10(prevPrice)) *
      this.midXBids /
      (Math.log10(
        this.bids[this.bids.length - 1].price === 0
          ? 1
          : this.bids[this.bids.length - 1].price
      ) -
        Math.log10(this.mid))
    );
  }

  calculateBidsStepHeight(bid: Order) {
    return this.coef * bid.depth;
  }

  generateBidsPoints = () => {
    let currentX = this.midXBids;
    let currentY = this.midY;
    let newX = this.midXBids;
    let newY = this.midY;
    const points = [currentX, currentY];

    this.bids.forEach((bid, index) => {
      newX = currentX - this.calculateBidsStepLength(bid, index);
      newY = this.midY - this.calculateBidsStepHeight(bid);

      points.push(currentX, newY, newX, newY);

      currentX = newX;
      currentY = newY;
    });
    this.pointsBids = points;
  };

  drawBids = () => {
    this.generateBidsPoints();

    this.graphics.push(
      <Line
        points={this.pointsBids}
        closed={false}
        stroke={chart.bids.lineColor}
        strokeWidth={chart.strokeWidth}
      />
    );
    this.graphics.push(
      <Line
        points={this.pointsBids.concat([
          0,
          this.midY,
          this.midXBids,
          this.midY
        ])}
        closed={true}
        fill={chart.bids.fillColor}
      />
    );
  };

  drawBidsPointerPadding = () => {
    this.graphics.push(
      <Pointer
        baseAsset={this.props.baseAsset}
        quoteAsset={this.props.quoteAsset}
        orders={this.bids}
        side={'bids'}
        points={this.pointsBids}
        borders={[0, this.midY, this.midXBids, 0]}
        color={chart.bids.lineColor}
        width={this.props.width}
        height={this.props.height}
        quoteAccuracy={this.props.quoteAccuracy}
        baseAccuracy={this.props.baseAccuracy}
        priceAccuracy={this.props.priceAccuracy}
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
    this.midXAsks = this.width / 2 + Math.round(chart.strokeWidth / 2);
    this.midXBids = this.width / 2 - Math.round(chart.strokeWidth / 2);
    this.midY = this.height;
    this.asks = this.props.asks.reverse();
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
