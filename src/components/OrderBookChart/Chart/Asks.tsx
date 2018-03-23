import * as React from 'react';

import {Line, Rect} from 'react-konva';

import {Order} from '../../../models';

import {OrdersProps} from './Models';

class Asks extends React.Component<OrdersProps> {
  asks: Order[];
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

  constructor(props: OrdersProps) {
    super(props);
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
      this.graphics.push(
        <Line
          points={[currentX, currentY, currentX, newY, newX, newY]}
          closed={false}
          stroke={this.lineColor}
          strokeWidth={this.strokeWidth}
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
        />
      );
      currentX = newX;
      currentY = newY;
    });
  };

  initialize() {
    this.graphics = [];
    this.asks = this.props.orders.reverse();
    this.stepLength = this.midX / this.asks.length;
    this.coef = this.height / this.asks[this.asks.length - 1].depth;
  }

  render() {
    this.initialize();
    this.drawAsks();
    return this.graphics;
  }
}

export default Asks;
