import * as React from 'react';

import {Line} from 'react-konva';

import {Order} from '../../../models';

import {OrdersProps} from './Models';

class Asks extends React.Component<OrdersProps> {
  lines: any = [];

  width = 1125;
  height = 549;

  midX = this.width / 2 - 2;
  midY = this.height;

  stepLength: number;
  coef: number;

  asks: Order[];

  color = '#ab00ff';
  strokeWidth = 3;

  constructor(props: OrdersProps) {
    super(props);
  }

  onMouseOver(ask: Order): void {
    // tslint:disable-next-line:no-console
    console.log(ask);
  }

  drawAsks = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    this.asks.forEach((ask, index) => {
      newX -= this.stepLength;
      newY = this.midY - this.coef * Math.ceil(ask.depth);
      newY > 0 ? (newY = newY) : (newY = this.strokeWidth);
      this.lines.push(
        <Line
          points={[currentX, currentY, currentX, newY, newX, newY]}
          closed={false}
          stroke={this.color}
          strokeWidth={this.strokeWidth}
          fill={this.color}
          // onMouseEnter={() => this.onMouseOver(ask)}
        />
      );
      currentX = newX;
      currentY = newY;
    });
  };

  initialize() {
    this.lines = [];
    this.asks = this.props.orders.reverse();
    this.stepLength = this.midX / this.asks.length;
    this.coef = this.height / this.asks[this.asks.length - 1].depth;
  }

  render() {
    this.initialize();
    this.drawAsks();
    return this.lines;
  }
}

export default Asks;
