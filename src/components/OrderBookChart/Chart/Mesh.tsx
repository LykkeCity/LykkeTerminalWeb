import * as React from 'react';

import {Line, Text} from 'react-konva';

import {ChartProps} from './Models';

class Mesh extends React.Component<ChartProps> {
  lines: any = [];

  width = 1080;
  height = 510;

  color = '#8c94a0';
  dash = [1, 3];
  strikeWidth = 1;

  verticalFontSize = 14;
  horizontalFontSize = 12;
  fontFamily = 'Proxima Nova';
  fontColor = '#8c94a0';

  stepVertical = this.width / 8;
  stepHorizontal = 40;

  startVertical = this.stepVertical / 2;
  startHorizontal = this.stepHorizontal / 2;

  constructor(props: ChartProps) {
    super(props);
  }

  generateHorizontalLabels = () => {
    const labels = [];
    const amount = (this.height - this.startHorizontal) / this.stepHorizontal;

    const maximum =
      Math.max(
        this.props.asks[0].depth,
        this.props.bids[this.props.bids.length - 1].depth
      ) + 5;
    const minimum = 0;

    const step = (maximum - minimum) / amount;

    for (let i = 0; i < amount; i++) {
      labels.push((minimum + step * i).toFixed(3));
    }

    return labels.reverse();
  };

  generateVerticalLabels = () => {
    const labels = [];
    const amount = (this.width - this.startVertical) / this.stepVertical;

    const minimum = this.props.bids[this.props.bids.length - 1].price;
    const maximum = this.props.asks[0].price;

    const step = (maximum - minimum) / amount;
    for (let i = 0; i < amount; i++) {
      labels.push((minimum + step * i).toFixed(3));
    }

    return labels;
  };

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
    const labels = this.generateVerticalLabels();

    for (
      let startX = this.startVertical, index = 0;
      startX < this.width;
      startX += this.stepVertical, index++
    ) {
      this.lines.push(
        <Line
          points={[startX, 0, startX, this.height]}
          closed={true}
          stroke={this.color}
          strokeWidth={this.strikeWidth}
          dash={this.dash}
          opacity={0.6}
        />
      );
      this.lines.push(
        <Text
          x={startX - 35}
          y={this.height + 15}
          fill={this.fontColor}
          fontFamily={this.fontFamily}
          fontSize={this.verticalFontSize}
          text={`${labels[index].toString()} USD`}
        />
      );
    }
  };

  drawHorizontal = () => {
    const labels = this.generateHorizontalLabels();

    for (
      let startY = this.startHorizontal, index = 0;
      startY < this.height;
      startY += this.stepHorizontal, index++
    ) {
      this.lines.push(
        <Line
          points={[0, startY, this.width, startY]}
          closed={true}
          stroke={this.color}
          strokeWidth={this.strikeWidth}
          dash={this.dash}
          opacity={0.6}
        />
      );
      this.lines.push(
        <Text
          x={this.width + 10}
          y={startY - this.horizontalFontSize / 2}
          fill={this.fontColor}
          fontFamily={this.fontFamily}
          fontSize={this.horizontalFontSize}
          text={`${labels[index].toString()}`}
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

export default Mesh;
