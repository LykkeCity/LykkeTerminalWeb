import * as React from 'react';

import Konva from 'konva';
import {Layer, Line, Stage} from 'react-konva';
import {Order} from '../../models';

interface ChartProps {
  asks: Order[];
  bids: Order[];
  mid: string;
}

interface OrdersProps {
  orders: Order[];
}

class Mesh extends React.Component {
  lines: any = [];

  width = 1125;
  height = 549;

  color = '#8c94a0';
  dash = [1, 3];
  strikeWidth = 1;

  stepVertical = 140;
  stepHorizontal = 40;

  startVertical = this.stepVertical / 2;
  startHorizontal = this.stepHorizontal / 2;

  drawMid = () => {
    this.lines.push(
      <Line
        points={[this.width / 2, 0, this.width / 2, this.height]}
        closed={true}
        stroke={this.color}
        strokeWidth={this.strikeWidth}
      />
    );
  };

  drawVertical = () => {
    for (let i = this.startVertical; i < this.width; i += this.stepVertical) {
      this.lines.push(
        <Line
          points={[i, 0, i, this.height]}
          closed={true}
          stroke={this.color}
          strokeWidth={this.strikeWidth}
          dash={this.dash}
          opacity={0.6}
        />
      );
    }
  };

  drawHorizontal = () => {
    for (
      let i = this.startHorizontal;
      i < this.height;
      i += this.stepHorizontal
    ) {
      this.lines.push(
        <Line
          points={[0, i, this.width, i]}
          closed={true}
          stroke={this.color}
          strokeWidth={this.strikeWidth}
          dash={this.dash}
          opacity={0.6}
        />
      );
    }
  };

  render() {
    this.lines = [];
    this.drawMid();
    this.drawHorizontal();
    this.drawVertical();

    return this.lines;
  }
}

// tslint:disable-next-line:max-classes-per-file
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
    this.asks = this.props.orders.reverse();
    this.stepLength = this.midX / this.asks.length;
    this.coef = this.height / this.asks[this.asks.length - 1].depth;
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

  render() {
    this.lines = [];
    this.drawAsks();
    return this.lines;
  }
}

// tslint:disable-next-line:max-classes-per-file
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
    this.bids = this.props.orders;
    this.stepLength = this.midX / this.bids.length;
    this.coef = this.height / this.bids[this.bids.length - 1].depth;
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

  render() {
    this.lines = [];
    this.drawAsks();
    return this.lines;
  }
}

// tslint:disable-next-line:max-classes-per-file
class Chart extends React.Component<ChartProps> {
  asks: Order[];
  bids: Order[];
  mid: string;

  width = 1125;
  height = 549;

  constructor(props: ChartProps) {
    super(props);
    this.asks = this.props.asks;
    this.bids = this.props.bids;
    this.mid = this.props.mid;
  }

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };

  render() {
    return (
      <Stage width={this.width} height={this.height}>
        <Layer>
          <Mesh />
          <Asks orders={this.asks} />
          <Bids orders={this.bids} />
        </Layer>
      </Stage>
    );
  }
}

export default Chart;
