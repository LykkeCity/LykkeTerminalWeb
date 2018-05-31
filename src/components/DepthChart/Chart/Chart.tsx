import * as React from 'react';

import {Line} from 'react-konva';

import {Order} from '../../../models';
import {Pointer} from './index';

import chart from './chartConstants';

interface ChartProps {
  asks: Order[];
  bids: Order[];
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

  midXAsks: number;
  midXBids: number;

  asksWidth: number;

  minDepth: number;
  maxDepth: number;

  coefficient: number;

  constructor(props: ChartProps) {
    super(props);
  }

  calculateAsksStepLength(ask: Order, index: number) {
    const start = Math.min(...this.props.asks.map(a => a.price));
    const end = Math.max(...this.props.asks.map(a => a.price));
    const priceDifference = this.props.asks[index + 1]
      ? this.props.asks[index + 1].price - start
      : this.props.asks[index].price - start;
    const priceRange = end - start;
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
    const points = [this.midXAsks, this.props.height];

    for (let index = 0; index < this.props.asks.length; index++) {
      newX =
        this.midXAsks +
        this.calculateAsksStepLength(this.props.asks[index], index);
      newY =
        this.props.height -
        this.calculateAsksStepHeight(this.props.asks[index]);
      points.push(currentX, newY, newX, newY);
      currentX = newX;
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
        points={[
          ...this.pointsAsks,
          this.props.width,
          this.props.height,
          this.midXBids,
          this.props.height
        ]}
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
        orders={this.props.asks}
        points={this.pointsAsks}
        borders={[this.midXAsks, this.props.height, this.props.width, 0]}
      />
    );
  };

  calculateBidsStepLength(bid: Order, index: number) {
    const start = Math.max(...this.props.bids.map(b => b.price));
    const end = Math.min(...this.props.bids.map(b => b.price));
    const priceDifference = this.props.bids[index + 1]
      ? start - this.props.bids[index + 1].price
      : start - this.props.bids[index].price;
    const priceRange = start - end;
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
    const points = [this.midXBids, this.props.height];

    for (let index = 0; index < this.props.bids.length; index++) {
      newX =
        this.midXBids -
        this.calculateBidsStepLength(this.props.bids[index], index);
      newY =
        this.props.height -
        this.calculateBidsStepHeight(this.props.bids[index]);
      points.push(currentX, newY, newX, newY);
      currentX = newX;
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
        points={[
          ...this.pointsBids,
          0,
          this.props.height,
          this.midXBids,
          this.props.height
        ]}
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
        orders={this.props.bids}
        points={this.pointsBids}
        borders={[0, this.props.height, this.midXBids, 0]}
      />
    );
  };

  calculatecoefficient() {
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
    this.coefficient = this.calculatecoefficient();
  }

  render() {
    this.initilaize();

    this.drawAsks();
    this.drawBids();

    if (this.props.asks.length > 0) {
      this.drawAsksPointerPadding();
    }
    if (this.props.bids.length > 0) {
      this.drawBidsPointerPadding();
    }

    return this.graphics;
  }
}

export default Chart;
