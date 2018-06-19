import * as React from 'react';
import {Line, Text} from 'react-konva';
import {Order} from '../../../models';

import formattedNumber from '../../../utils/localFormatted/localFormatted';
import chart from './chartConstants';

interface MeshProps {
  asks: Order[];
  bids: Order[];
  width: number;
  height: number;
  quoteAccuracy: number;
  baseAccuracy: number;
  priceAccuracy: number;
}

class Mesh extends React.Component<MeshProps> {
  asks: Order[];
  bids: Order[];
  mesh: any = [];

  width: number;
  height: number;

  labels: string[] = [];

  emptyLabels: string[] = ['', '', '', ''];

  constructor(props: MeshProps) {
    super(props);
  }

  generateAsksLabels = (): string[] => {
    const asksLabels = [];
    if (this.props.asks.length > 0) {
      const start = Math.min(...this.props.asks.map(a => a.price));
      const end = Math.max(...this.props.asks.map(a => a.price));
      const step = (end - start) / chart.mesh.verticalLinesAmount;
      for (let i = 0; i < chart.mesh.verticalLinesAmount; i++) {
        if (i % 2 === 1) {
          const label = formattedNumber(
            start + step * i,
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
    if (this.props.bids.length > 0) {
      const start = Math.max(...this.props.bids.map(b => b.price));
      const end = Math.min(...this.props.bids.map(b => b.price));
      const step = (start - end) / chart.mesh.verticalLinesAmount;
      for (let i = chart.mesh.verticalLinesAmount; i > 0; i--) {
        if (i % 2 === 1) {
          const label = formattedNumber(
            start - step * i,
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
    return Math.max(
      ...this.props.asks.map(a => a.depth),
      ...this.props.bids.map(b => b.depth)
    );
  };

  generateHorizontalLabels = () => {
    const labels = [];
    if (this.props.asks.length > 0 || this.props.bids.length > 0) {
      const maximum = this.calculateMaxDepth() / chart.scaleFactor;
      const step = maximum / chart.mesh.horizontalLinesAmount;
      for (let i = 0; i < chart.mesh.horizontalLinesAmount; i++) {
        const value = step * (i + 1) - step / 2;
        let formattedLabel;
        value < 1000
          ? (formattedLabel = formattedNumber(value, chart.labelsAccuracy))
          : (formattedLabel = `${formattedNumber(value / 1000, 1)}k`);
        labels.push(formattedLabel);
      }
    }
    return labels.reverse();
  };

  drawMid = () => {
    this.mesh.push(
      <Line
        key="mid"
        points={[
          this.props.width / 2,
          0,
          this.props.width / 2,
          this.props.height
        ]}
        closed={true}
        stroke={chart.mesh.color}
        strokeWidth={chart.mesh.strikeWidth}
        dashEnabled={false}
        shadowEnabled={false}
        listening={false}
      />
    );
  };

  drawVerticalLines = () => {
    const stepVertical = this.props.width / chart.mesh.verticalLinesAmount;
    const startVertical = stepVertical / 2;
    for (
      let startX = startVertical, index = 0;
      startX < this.props.width;
      startX += stepVertical, index++
    ) {
      this.mesh.push(
        <Line
          key={`vl-${index}`}
          points={[startX, 0, startX, this.props.height]}
          closed={true}
          stroke={chart.mesh.color}
          strokeWidth={chart.mesh.strikeWidth}
          dash={chart.mesh.dots}
          opacity={0.6}
          shadowEnabled={false}
          listening={false}
        />
      );
    }
  };

  drawVerticalLabels = () => {
    const stepVertical = this.props.width / chart.mesh.verticalLinesAmount;
    const startVertical = stepVertical / 2;
    const labels = this.generateVerticalLabels();
    if (labels.length > 0) {
      for (
        let startX = startVertical, index = 0;
        startX < this.props.width;
        startX += stepVertical, index++
      ) {
        this.mesh.push(
          <Text
            key={`vt-${index}`}
            x={startX - 35}
            y={this.props.height + 15}
            fill={chart.mesh.color}
            fontFamily={chart.mesh.fontFamily}
            fontSize={chart.mesh.verticalFontSize}
            text={`${labels[index]}`}
            listening={false}
          />
        );
      }
    }
  };

  drawHorizontalLines = () => {
    const stepHorizontal = this.props.height / chart.mesh.horizontalLinesAmount;
    const startHorizontal = stepHorizontal / 2;
    for (
      let startY = startHorizontal, index = 0;
      startY < this.props.height;
      startY += stepHorizontal, index++
    ) {
      this.mesh.push(
        <Line
          key={`hl-${index}`}
          points={[0, startY, this.props.width, startY]}
          closed={true}
          stroke={chart.mesh.color}
          strokeWidth={chart.mesh.strikeWidth}
          dash={chart.mesh.dash}
          opacity={0.6}
          shadowEnabled={false}
          listening={false}
        />
      );
    }
  };

  drawHorizontalLabels = () => {
    const stepHorizontal = this.props.height / chart.mesh.horizontalLinesAmount;
    const startHorizontal = stepHorizontal / 2;
    this.labels = this.generateHorizontalLabels();
    if (this.labels.length > 0) {
      for (
        let startY = startHorizontal, index = 0;
        startY < this.props.height;
        startY += stepHorizontal, index++
      ) {
        this.mesh.push(
          <Text
            key={`ht-${index}`}
            x={this.props.width + 10}
            y={startY - chart.mesh.horizontalFontSize / 2}
            fill={chart.mesh.color}
            fontFamily={chart.mesh.fontFamily}
            fontSize={chart.mesh.horizontalFontSize}
            text={`${this.labels[index]}`}
            listening={false}
          />
        );
      }
    }
  };

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
    this.mesh = [];
    this.labels = [];
    this.renderMesh();
    this.renderLabels();
    return this.mesh;
  }
}

export default Mesh;
