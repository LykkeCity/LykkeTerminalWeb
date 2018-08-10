import * as React from 'react';
import {Order} from '../../../models';

import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import chart from './chartConstants';

import {
  defineCanvasScale,
  drawLine,
  drawText,
  drawVerticalLine
} from '../../../utils/canvasUtils';

interface MeshProps {
  asks: Order[];
  bids: Order[];
  width: number;
  height: number;
  canvasHeight: number;
  canvasWidth: number;
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
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  memoWidth: number = 0;

  constructor(props: MeshProps) {
    super(props);
  }

  componentDidMount() {
    this.canvasCtx = this.canvas!.getContext('2d');
    window.requestAnimationFrame(() => {
      this.renderCanvas();
      this.forceUpdate();
    });

    defineCanvasScale(
      this.canvasCtx,
      this.canvas,
      this.props.canvasWidth,
      this.props.canvasHeight
    );
  }

  componentWillReceiveProps({canvasWidth}: MeshProps) {
    window.requestAnimationFrame(() => {
      if (canvasWidth !== this.memoWidth) {
        this.memoWidth = canvasWidth;
        defineCanvasScale(
          this.canvasCtx,
          this.canvas,
          this.props.canvasWidth,
          this.props.canvasHeight
        );
      }
      this.renderCanvas();
      this.forceUpdate();
    });
  }

  generateAsksLabels = (): string[] => {
    const asksLabels = [];
    if (this.props.asks.length > 0) {
      const prices = this.props.asks.map(a => a.price);
      const start = Math.min(...prices);
      const end = Math.max(...prices);
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
    drawVerticalLine({
      ctx: this.canvasCtx!,
      opacity: 0.6,
      color: chart.mesh.color,
      lineWidth: chart.mesh.strokeWidth,
      height: this.props.height,
      x: this.props.width / 2,
      y: 0
    });
  };

  drawVerticalLines = () => {
    const stepVertical = this.props.width / chart.mesh.verticalLinesAmount;
    const startVertical = stepVertical / 2;
    for (
      let startX = startVertical, index = 0;
      startX < this.props.width;
      startX += stepVertical, index++
    ) {
      drawVerticalLine({
        ctx: this.canvasCtx!,
        opacity: 0.6,
        color: chart.mesh.color,
        dashSegments: chart.mesh.dots,
        lineWidth: chart.mesh.strokeWidth,
        height: this.props.height,
        x: startX,
        y: 0
      });
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
        drawText({
          ctx: this.canvasCtx!,
          color: chart.mesh.color,
          text: `${labels[index]}`,
          x: startX,
          y: this.props.height + 15,
          font: `${chart.mesh.verticalFontSize}px ${chart.mesh.fontFamily}`
        });
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
      drawLine({
        ctx: this.canvasCtx!,
        opacity: 0.6,
        color: chart.mesh.color,
        dashSegments: chart.mesh.dash,
        lineWidth: chart.mesh.strokeWidth,
        width: this.props.width,
        x: 0,
        y: startY
      });
    }
  };

  drawHorizontalLabels = () => {
    const stepHorizontal = this.props.height / chart.mesh.horizontalLinesAmount;
    const startHorizontal = stepHorizontal / 2 + 9;
    this.labels = this.generateHorizontalLabels();
    if (this.labels.length > 0) {
      for (
        let startY = startHorizontal, index = 0;
        startY < this.props.height;
        startY += stepHorizontal, index++
      ) {
        drawText({
          ctx: this.canvasCtx!,
          color: chart.mesh.color,
          text: `${this.labels[index]}`,
          x: this.props.width + 25,
          y: startY - chart.mesh.horizontalFontSize / 2,
          font: `${chart.mesh.horizontalFontSize}px ${chart.mesh.fontFamily}`
        });
      }
    }
  };

  renderCanvas = () => {
    if (this.canvas) {
      this.canvasCtx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.drawHorizontalLines();
    this.drawVerticalLines();
    this.drawVerticalLabels();
    this.drawHorizontalLabels();
    this.drawMid();
  };

  setCanvasRef = (canvas: any) => (this.canvas = canvas);

  render() {
    return (
      <React.Fragment>
        <canvas
          width={this.props.canvasWidth}
          height={this.props.canvasHeight}
          ref={this.setCanvasRef}
        />
      </React.Fragment>
    );
  }
}

export default Mesh;
