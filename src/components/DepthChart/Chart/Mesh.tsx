import * as React from 'react';
import {Line, Text} from 'react-konva';
import {Order} from '../../../models';

import chart from './chartConstants';

interface MeshProps {
  asks: Order[];
  bids: Order[];
  mid: number;
  width: number;
  height: number;
  setLabelsWidth: any;
  quoteAccuracy: number;
  baseAccuracy: number;
  priceAccuracy: number;
}

class Mesh extends React.Component<MeshProps> {
  mid: number;
  asks: Order[];
  bids: Order[];
  mesh: any = [];

  width: number;
  height: number;

  emptyLabels: string[] = ['', '', '', ''];

  constructor(props: MeshProps) {
    super(props);
  }

  generateAsksLabels = (): string[] => {
    const asksLabels = [];
    if (this.asks.length > 0) {
      const step =
        (this.asks[0].price - this.mid) / chart.mesh.verticalLinesAmount;
      for (let i = 0; i < chart.mesh.verticalLinesAmount; i++) {
        if (i % 2 === 1) {
          const label = formattedNumber(
            this.mid + step * i,
            this.props.priceAccuracy
          );
          asksLabels.push(label);
        }
      }
    }
    return asksLabels.length > 0 ? asksLabels : this.emptyLabels;
  };

  generateBidsLabels = (): string[] => {
    const bidsLabels = [];
    if (this.bids.length > 0) {
      const step =
        (this.mid - this.bids[this.bids.length - 1].price) /
        chart.mesh.verticalLinesAmount;
      for (let i = chart.mesh.verticalLinesAmount; i > 0; i--) {
        if (i % 2 === 1) {
          const label = formattedNumber(
            this.mid - step * i,
            this.props.priceAccuracy
          );
          bidsLabels.push(label);
        }
      }
    }
    return bidsLabels.length > 0 ? bidsLabels : this.emptyLabels;
  };

  generateVerticalLabels = () => {
    return this.generateBidsLabels().concat(this.generateAsksLabels());
  };

  calculateMaxDepth = () => {
    if (this.asks.length > 0 && this.bids.length > 0) {
      return Math.max(
        this.asks[0].depth,
        this.bids[this.bids.length - 1].depth
      );
    } else if (this.asks.length > 0) {
      return this.asks[0].depth;
    } else if (this.bids.length > 0) {
      return this.bids[this.bids.length - 1].depth;
    }
    return 1;
  };

  generateHorizontalLabels = () => {
    const labels = [];
    const maximum = this.calculateMaxDepth() / chart.scaleFactor;

    const step = maximum / chart.mesh.horizontalLinesAmount;
    for (let i = 0; i < chart.mesh.horizontalLinesAmount; i++) {
      labels.push(formattedNumber(step * (i + 1) - step / 2, 2));
    }
    return labels.reverse();
  };

  drawMid = () => {
    this.mesh.push(
      <Line
        key="mid"
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
          key={`vl-${index}`}
          points={[startX, 0, startX, this.height]}
          closed={true}
          stroke={chart.mesh.color}
          strokeWidth={chart.mesh.strikeWidth}
          dash={chart.mesh.dots}
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
            key={`vt-${index}`}
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
          key={`hl-${index}`}
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
            key={`ht-${index}`}
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
