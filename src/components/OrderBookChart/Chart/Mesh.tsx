import * as React from 'react';

import {Line, Text} from 'react-konva';

import {ChartProps} from './Models';

import chart from './chartConstants';

class Mesh extends React.Component<ChartProps> {
  lines: any = [];

  width = 1080;
  height = 510;

  stepVertical = this.width / 8;
  stepHorizontal = this.height / 22;

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
      labels.push((minimum + step * i).toFixed(2));
    }

    return labels.reverse();
  };

  generateVerticalLabels = () => {
    const labels = [];
    const amount = (this.width - this.startVertical) / this.stepVertical + 1;

    const minimum = 0;
    const maximum = this.props.asks[0].price;

    const step = (maximum - minimum) / amount;
    for (let i = 0; i < amount; i++) {
      labels.push((minimum + step * (i + 1)).toFixed(3));
    }

    return labels;
  };

  drawMid = () => {
    this.lines.push(
      <Line
        points={[this.width / 2, 0, this.width / 2, this.height]}
        closed={true}
        stroke={chart.mesh.color}
        strokeWidth={chart.mesh.strikeWidth}
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
          stroke={chart.mesh.color}
          strokeWidth={chart.mesh.strikeWidth}
          dash={chart.mesh.dash}
          opacity={0.6}
        />
      );
      this.lines.push(
        <Text
          x={startX - 35}
          y={this.height + 15}
          fill={chart.mesh.color}
          fontFamily={chart.mesh.fontFamily}
          fontSize={chart.mesh.verticalFontSize}
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
          stroke={chart.mesh.color}
          strokeWidth={chart.mesh.strikeWidth}
          dash={chart.mesh.dash}
          opacity={0.6}
        />
      );
      this.lines.push(
        <Text
          x={this.width + 10}
          y={startY - chart.mesh.horizontalFontSize / 2}
          fill={chart.mesh.color}
          fontFamily={chart.mesh.fontFamily}
          fontSize={chart.mesh.horizontalFontSize}
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
