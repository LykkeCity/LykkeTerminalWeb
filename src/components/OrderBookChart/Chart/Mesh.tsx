import * as React from 'react';

import {Line, Text} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';

import chart from './chartConstants';

class Mesh extends React.Component<ChartProps> {
  asks: Order[];
  bids: Order[];
  mesh: any = [];

  width: number = chart.width - chart.labelsWidth;
  height: number = chart.height - chart.labelsHeight;

  stepVertical = this.width / chart.mesh.verticalLinesAmount;
  stepHorizontal = this.height / chart.mesh.horizontalLinesAmount;

  startVertical = this.stepVertical / 2;
  startHorizontal = this.stepHorizontal / 2;

  constructor(props: ChartProps) {
    super(props);
  }

  generateVerticalLabels = () => {
    const labels = [];
    if (this.asks.length > 0 && this.bids.length > 0) {
      const minimum = 0;
      const maximum = this.asks[0].price;

      const step = (maximum - minimum) / chart.mesh.verticalLinesAmount;
      for (let i = 0; i < chart.mesh.verticalLinesAmount; i++) {
        labels.push((minimum + step * (i + 1)).toFixed(3));
      }
    }
    return labels;
  };

  generateHorizontalLabels = () => {
    const labels = [];
    if (this.asks.length > 0 && this.bids.length > 0) {
      const maxDepth = Math.max(
        this.asks[0].depth,
        this.bids[this.bids.length - 1].depth
      );
      const maximum = maxDepth + maxDepth / 2;
      const minimum = 0;

      const step = (maximum - minimum) / chart.mesh.horizontalLinesAmount;
      for (let i = 0; i < chart.mesh.horizontalLinesAmount; i++) {
        labels.push((minimum + step * i).toFixed(2));
      }
    }
    return labels.reverse();
  };

  drawMid = () => {
    this.mesh.push(
      <Line
        points={[this.width / 2, 0, this.width / 2, this.height]}
        closed={true}
        stroke={chart.mesh.color}
        strokeWidth={chart.mesh.strikeWidth}
      />
    );
  };

  drawVerticalLines = () => {
    for (
      let startX = this.startVertical, index = 0;
      startX < this.width;
      startX += this.stepVertical, index++
    ) {
      this.mesh.push(
        <Line
          points={[startX, 0, startX, this.height]}
          closed={true}
          stroke={chart.mesh.color}
          strokeWidth={chart.mesh.strikeWidth}
          dash={chart.mesh.dash}
          opacity={0.6}
        />
      );
    }
  };

  drawVerticalLabels = () => {
    const labels = this.generateVerticalLabels();
    if (labels.length > 0) {
      for (
        let startX = this.startVertical, index = 0;
        startX < this.width;
        startX += this.stepVertical, index++
      ) {
        this.mesh.push(
          <Text
            x={startX - 35}
            y={this.height + 15}
            fill={chart.mesh.color}
            fontFamily={chart.mesh.fontFamily}
            fontSize={chart.mesh.verticalFontSize}
            text={`${labels[index]} ${this.props.quoteAsset}`}
          />
        );
      }
    }
  };

  drawHorizontalLines = () => {
    for (
      let startY = this.startHorizontal, index = 0;
      startY < this.height;
      startY += this.stepHorizontal, index++
    ) {
      this.mesh.push(
        <Line
          points={[0, startY, this.width, startY]}
          closed={true}
          stroke={chart.mesh.color}
          strokeWidth={chart.mesh.strikeWidth}
          dash={chart.mesh.dash}
          opacity={0.6}
        />
      );
    }
  };

  drawHorizontalLabels = () => {
    const labels = this.generateHorizontalLabels();
    if (labels.length > 0) {
      for (
        let startY = this.startHorizontal, index = 0;
        startY < this.height;
        startY += this.stepHorizontal, index++
      ) {
        this.mesh.push(
          <Text
            x={this.width + 10}
            y={startY - chart.mesh.horizontalFontSize / 2}
            fill={chart.mesh.color}
            fontFamily={chart.mesh.fontFamily}
            fontSize={chart.mesh.horizontalFontSize}
            text={`${labels[index]}`}
          />
        );
      }
    }
  };

  initilaize() {
    this.mesh = [];
    this.asks = this.props.asks;
    this.bids = this.props.bids;
  }

  renderMesh = () => {
    this.drawMid();
    this.drawHorizontalLines();
    this.drawVerticalLines();
  };

  renderLabels = () => {
    this.drawHorizontalLabels();
    this.drawVerticalLabels();
  };

  render() {
    this.initilaize();
    this.renderMesh();
    this.renderLabels();
    return this.mesh;
  }
}

export default Mesh;
