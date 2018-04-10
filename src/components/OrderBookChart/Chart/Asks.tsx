import * as React from 'react';

import {Line} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';
import Pointer from './Pointer';

import chart from './chartConstants';

class Asks extends React.Component<ChartProps> {
  graphics: any[] = [];
  points: number[] = [];

  width: number = -1;
  height: number = -1;

  asks: Order[];
  bids: Order[];
  mid: number;

  midX: number;
  midY: number;

  coef: number;

  constructor(props: ChartProps) {
    super(props);
  }

  calculateStepLength(ask: Order, index: number) {
    const prevPrice = this.asks[index - 1]
      ? this.asks[index - 1].price
      : this.mid;
    return (
      (ask.price - prevPrice) *
      this.midX /
      (this.asks[this.asks.length - 1].price - this.mid)
    );
  }

  calculateStepHeight(ask: Order) {
    return this.coef * Math.ceil(ask.depth);
  }

  generatePoints = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    const points = [currentX, currentY];
    this.asks.forEach((ask, index) => {
      newX = currentX + this.calculateStepLength(ask, index);
      newY = this.midY - this.calculateStepHeight(ask);
      points.push(currentX, newY, newX, newY);
      currentX = newX;
      currentY = newY;
    });
    this.points = points;
  };

  drawAsks = () => {
    this.graphics.push(
      <Line
        points={this.points}
        closed={false}
        stroke={chart.asks.lineColor}
        strokeWidth={chart.strokeWidth}
      />
    );
    this.graphics.push(
      <Line
        points={this.points.concat([this.width, this.height])}
        closed={true}
        fill={chart.asks.fillColor}
      />
    );
  };

  drawPointerPadding = () => {
    this.graphics.push(
      <Pointer
        baseAsset={this.props.baseAsset}
        quoteAsset={this.props.quoteAsset}
        orders={this.asks}
        side={'asks'}
        points={this.points}
        borders={[this.midX, this.midY, this.width, 0]}
        color={chart.asks.lineColor}
        width={this.props.width}
        height={this.props.height}
      />
    );
  };

  calculateCoef() {
    if (this.asks[this.asks.length - 1] && this.asks[this.asks.length - 1]) {
      const maxDepth = Math.max(
        this.asks[this.asks.length - 1].depth,
        this.bids[this.bids.length - 1].depth
      );
      return this.height / (maxDepth + maxDepth / 2);
    } else {
      return 1;
    }
  }

  initilaize() {
    this.graphics = [];
    this.width = this.props.width;
    this.height = this.props.height;
    this.midX = this.width / 2 + Math.round(chart.strokeWidth / 2);
    this.midY = this.height;
    this.asks = this.props.asks.reverse();
    this.bids = this.props.bids;
    this.mid = parseFloat(this.props.mid);
    this.coef = this.calculateCoef();
  }

  render() {
    this.initilaize();
    this.generatePoints();
    this.drawAsks();
    this.drawPointerPadding();
    return this.graphics;
  }
}

export default Asks;
