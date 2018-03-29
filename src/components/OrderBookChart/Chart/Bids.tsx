import * as React from 'react';

import {Line} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';

import chart from './chartConstants';

class Bids extends React.Component<ChartProps> {
  graphics: any = [];
  width: number = 1080;
  height: number = 500;
  asks: Order[];
  bids: Order[];
  mid: number;

  midX = this.width / 2 - Math.round(chart.strokeWidth / 2);
  midY = this.height;

  coef: number;

  constructor(props: ChartProps) {
    super(props);
  }

  showMessage(ask: Order, index: number) {
    // tslint:disable-next-line:no-console
    console.log(`${index}: ${ask.price}`);
  }

  calculateStepLength(bid: Order, index: number) {
    const prevPrice = this.bids[index - 1]
      ? this.bids[index - 1].price
      : this.mid;
    return (
      (bid.price - prevPrice) *
      this.midX /
      (this.bids[this.bids.length - 1].price - this.mid)
    );
  }

  calculateStepHeight(bid: Order) {
    return this.coef * Math.ceil(bid.depth);
  }

  generatePoints = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    const points = [currentX, currentY];
    this.bids.forEach((bid, index) => {
      newX = currentX - this.calculateStepLength(bid, index);
      newY = this.midY - this.calculateStepHeight(bid);
      points.push(currentX, newY, newX, newY);
      currentX = newX;
      currentY = newY;
    });
    return points;
  };

  drawBids = () => {
    let points = this.generatePoints();
    this.graphics.push(
      <Line
        points={points}
        closed={false}
        stroke={chart.bids.lineColor}
        strokeWidth={chart.strokeWidth}
      />
    );
    points = points.concat([0, this.height]);
    this.graphics.push(
      <Line points={points} closed={true} fill={chart.bids.fillColor} />
    );
  };

  calculateCoef() {
    if (this.asks[this.asks.length - 1] && this.asks[this.asks.length - 1]) {
      const maxDepth = Math.max(
        this.asks[this.asks.length - 1].depth,
        this.bids[this.bids.length - 1].depth
      );
      return this.height / (maxDepth + 5);
    } else {
      return 1;
    }
  }

  initialize() {
    this.graphics = [];
    this.asks = this.props.asks;
    this.bids = this.props.bids;
    this.mid = parseFloat(this.props.mid);
    this.coef = this.calculateCoef();
  }

  render() {
    this.initialize();
    this.drawBids();
    return this.graphics;
  }
}

export default Bids;
