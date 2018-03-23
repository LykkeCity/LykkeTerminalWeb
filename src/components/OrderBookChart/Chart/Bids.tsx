import * as React from 'react';

import {Line, Rect} from 'react-konva';

import {Order} from '../../../models';

import {OrdersProps} from './Models';

class Bids extends React.Component<OrdersProps> {
  bids: Order[];
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

  constructor(props: OrdersProps) {
    super(props);
  }

  drawAsks = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    this.bids.forEach((bid, index) => {
      newX += this.stepLength;
      newY = this.midY - this.coef * Math.ceil(bid.depth);
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
        />
      );
      currentX = newX;
      currentY = newY;
    });
  };

  initilaize() {
    this.graphics = [];
    this.bids = this.props.orders;
    this.stepLength = this.midX / this.bids.length;
    this.coef = this.height / this.bids[this.bids.length - 1].depth;
  }

  render() {
    this.initilaize();
    this.drawAsks();
    return this.graphics;
  }
}

export default Bids;
