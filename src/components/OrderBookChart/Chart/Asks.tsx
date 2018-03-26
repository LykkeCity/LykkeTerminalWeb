import * as React from 'react';

import {Line, Rect} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';

class Asks extends React.Component<ChartProps> {
  asks: Order[];
  bids: Order[];
  mid: number;
  graphics: any = [];

  width = 1080;
  height = 500;

  lineColor = '#ffae2c';
  blockColor = 'rgba(255, 174, 44, 0.15)';
  blockStrokeColor = 'rgba(255, 174, 44, 0.001)';
  strokeWidth = 3;

  midX = this.width / 2 + Math.round(this.strokeWidth / 2);
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

  drawAsks = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    this.asks.forEach((ask, index) => {
      newX += this.calculateStepLength(ask, index);
      newY = this.midY - this.calculateStepHeight(ask);
      newY > this.strokeWidth ? (newY = newY) : (newY = this.strokeWidth);
      this.graphics.push(
        <Line
          points={[currentX, currentY, currentX, newY, newX, newY]}
          closed={false}
          stroke={this.lineColor}
          strokeWidth={this.strokeWidth}
          // tslint:disable-next-line:jsx-no-lambda
          onMouseOver={() => this.showMessage(ask, index)}
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
          // tslint:disable-next-line:jsx-no-lambda
          onMouseOver={() => this.showMessage(ask, index)}
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

  initilaize() {
    this.graphics = [];
    this.asks = this.props.asks.reverse();
    this.bids = this.props.bids;
    this.mid = parseFloat(this.props.mid);
    this.calculateCoef();
    // tslint:disable-next-line:no-console
    console.log(this.asks);
    // tslint:disable-next-line:no-console
    console.log(this.bids);
    // tslint:disable-next-line:no-console
    console.log(this.mid);
  }

  render() {
    this.initilaize();
    this.drawAsks();
    return this.graphics;
  }
}

export default Asks;
