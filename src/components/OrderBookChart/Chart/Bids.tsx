import * as React from 'react';

import {Line, Rect} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';

class Bids extends React.Component<ChartProps> {
  asks: Order[];
  bids: Order[];
  mid: number;
  graphics: any = [];

  width = 1080;
  height = 500;

  lineColor = '#ab00ff';
  blockColor = 'rgba(171, 0, 255, 0.2)';
  blockStrokeColor = 'rgba(171, 0, 255, 0.05)';
  strokeWidth = 3;

  midX = this.width / 2 - Math.round(this.strokeWidth / 2);
  midY = this.height;

  stepLength: number;
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

  drawBids = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    this.bids.forEach((bid, index) => {
      newX = currentX - this.calculateStepLength(bid, index);
      newY = this.midY - this.calculateStepHeight(bid);
      newY > this.strokeWidth ? (newY = newY) : (newY = this.strokeWidth);
      this.graphics.push(
        <Line
          points={[currentX, currentY, currentX, newY, newX, newY]}
          closed={false}
          stroke={this.lineColor}
          strokeWidth={this.strokeWidth}
          // tslint:disable-next-line:jsx-no-lambda
          onMouseOver={() => this.showMessage(bid, index)}
        />
      );
      this.graphics.push(
        <Rect
          x={newX}
          y={newY}
          width={currentX - newX}
          height={this.midY - newY}
          stroke={this.blockStrokeColor}
          fill={this.blockColor}
          opacity={0.2}
          // tslint:disable-next-line:jsx-no-lambda
          onMouseOver={() => this.showMessage(bid, index)}
        />
      );
      currentX = newX;
      currentY = newY;
    });
  };

  calculateCoef() {
    const maxDepth = Math.max(
      this.asks[this.asks.length - 1].depth,
      this.bids[this.bids.length - 1].depth
    );
    if (this.asks[this.asks.length - 1]) {
      this.coef = this.height / (maxDepth + 5);
    } else {
      this.coef = 1;
    }
  }

  initialize() {
    this.graphics = [];
    this.asks = this.props.asks;
    this.bids = this.props.bids;
    this.mid = parseFloat(this.props.mid);
    this.calculateCoef();
  }

  render() {
    this.initialize();
    this.drawBids();
    return this.graphics;
  }
}

export default Bids;
