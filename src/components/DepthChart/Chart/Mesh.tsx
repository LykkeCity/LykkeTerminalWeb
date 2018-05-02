import * as React from 'react';

import {Line, Text} from 'react-konva';

import {Order} from '../../../models';

import {ChartProps} from './Models';

import chart from './chartConstants';

class Mesh extends React.Component<ChartProps> {
  mid: number;
  asks: Order[];
  bids: Order[];
  mesh: any = [];

  width: number;
  height: number;

  constructor(props: ChartProps) {
    super(props);
  }

  generateVerticalLabels = () => {
    let labels: string[] = [];
    const bidsLabels = [];
    const asksLabels = [];

    if (this.asks.length > 0 && this.bids.length > 0) {
      const maximum = this.asks[0].price;

      let step;
      step =
        (this.mid - this.bids[this.bids.length - 1].price) /
        chart.mesh.verticalLinesAmount;
      for (let i = chart.mesh.verticalLinesAmount; i > 0; i--) {
        if (i % 2 === 1) {
          bidsLabels.push(
            (this.mid - step * i).toLocaleString(undefined, {
              maximumFractionDigits: this.props.priceAccuracy
            })
          );
        }
      }

      step = (maximum - this.mid) / chart.mesh.verticalLinesAmount;
      for (let i = 0; i < chart.mesh.verticalLinesAmount; i++) {
        if (i % 2 === 1) {
          asksLabels.push(
            (this.mid + step * i).toLocaleString(undefined, {
              maximumFractionDigits: this.props.priceAccuracy
            })
          );
        }
      }

      labels = bidsLabels.concat(asksLabels);
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

      const step = maximum / chart.mesh.horizontalLinesAmount;
      for (let i = 0; i < chart.mesh.horizontalLinesAmount; i++) {
        labels.push(
          (step * (i + 1) - step / 2).toLocaleString(undefined, {
            maximumFractionDigits: 2
          })
        );
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
    const stepVertical = this.width / chart.mesh.verticalLinesAmount;
    const startVertical = stepVertical / 2;
    for (
      let startX = startVertical, index = 0;
      startX < this.width;
      startX += stepVertical, index++
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
    const stepVertical = this.width / chart.mesh.verticalLinesAmount;
    const startVertical = stepVertical / 2;
    const labels = this.generateVerticalLabels();
    if (labels.length > 0) {
      for (
        let startX = startVertical, index = 0;
        startX < this.width;
        startX += stepVertical, index++
      ) {
        this.mesh.push(
          <Text
            x={startX - 35}
            y={this.height + 15}
            fill={chart.mesh.color}
            fontFamily={chart.mesh.fontFamily}
            fontSize={chart.mesh.verticalFontSize}
            text={`${labels[index]}`}
          />
        );
      }
    }
  };

  drawHorizontalLines = () => {
    const stepHorizontal = this.height / chart.mesh.horizontalLinesAmount;
    const startHorizontal = stepHorizontal / 2;
    for (
      let startY = startHorizontal, index = 0;
      startY < this.height;
      startY += stepHorizontal, index++
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
    const stepHorizontal = this.height / chart.mesh.horizontalLinesAmount;
    const startHorizontal = stepHorizontal / 2;
    const labels = this.generateHorizontalLabels();
    if (labels.length > 0) {
      for (
        let startY = startHorizontal, index = 0;
        startY < this.height;
        startY += stepHorizontal, index++
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
    this.mid = this.props.mid;
    this.asks = this.props.asks;
    this.bids = this.props.bids;
    this.mesh = [];
    this.width = this.props.width;
    this.height = this.props.height;
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
