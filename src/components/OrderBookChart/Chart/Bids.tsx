import * as React from 'react';

import {Line} from 'react-konva';

import {Order} from '../../../models';

import {OrdersProps} from './Models';

class Bids extends React.Component<OrdersProps> {
  lines: any = [];

  width = 1125;
  height = 549;

  midX = this.width / 2 + 2;
  midY = this.height;

  stepLength: number;
  coef: number;

  bids: Order[];

  color = '#ffae2c';
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
    this.bids.forEach((bid, index) => {
      newX += this.stepLength;
      newY = this.midY - this.coef * Math.ceil(bid.depth);
      newY > 0 ? (newY = newY) : (newY = this.strokeWidth);
      this.lines.push(
        <Line
          points={[currentX, currentY, currentX, newY, newX, newY]}
          closed={false}
          stroke={this.color}
          strokeWidth={this.strokeWidth}
          fill={this.color}
          // onMouseEnter={() => this.onMouseOver(bid)}
        />
      );
      currentX = newX;
      currentY = newY;
    });
  };

  initilaize() {
    this.lines = [];
    this.bids = this.props.orders;
    this.stepLength = this.midX / this.bids.length;
    this.coef = this.height / this.bids[this.bids.length - 1].depth;
  }

  render() {
    this.initilaize();
    this.drawAsks();
    return this.lines;
  }
}

export default Bids;
