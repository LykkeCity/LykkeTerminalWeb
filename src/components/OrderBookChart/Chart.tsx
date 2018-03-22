import * as React from 'react';

import Konva from 'konva';
import {Layer, Line, Stage} from 'react-konva';
import {Order} from '../../models';

interface ChartProps {
  asks: Order[];
  bids: Order[];
  mid: string;
}

interface AsksProps {
  asks: Order[];
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
class Asks extends React.Component<AsksProps> {
  lines: any = [];

  width = 1125;
  height = 549;

  midX = this.width / 2;
  midY = this.height;

  stepLength: number;
  coef: number;

  asks: Order[];

  color = '#ab00ff';

  constructor(props: AsksProps) {
    super(props);
    this.asks = this.props.asks.reverse();
    this.stepLength = this.midX / this.asks.length;
    this.coef = this.height / this.asks[this.asks.length - 1].depth;
  }

  drawAsks = () => {
    let currentX = this.midX;
    let currentY = this.midY;
    let newX = this.midX;
    let newY = this.midY;
    this.asks.forEach((ask, index) => {
      newX -= this.stepLength;
      newY = this.midY - this.coef * Math.ceil(ask.depth);
      newY > 0 ? (newY = newY) : (newY = 1);
      this.lines.push(
        <Line
          points={[currentX, currentY, currentX, newY, newX, newY]}
          closed={false}
          stroke={this.color}
          strokeWidth={2}
          opacity={0.6}
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
          <Asks asks={this.asks} />
          <Mesh />
        </Layer>
      </Stage>
    );
  }
}

export default Chart;
