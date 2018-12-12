import * as React from 'react';
import chart from '../../../constants/chartConstants';
import {defineCanvasScale} from '../../../utils/canvasUtils';
import {drawMeshElements, IMeshDrawingTools} from '../helpers/chartHelpers';

const VERTICAL_LINE_PADDING = 15;
const HORIZONTAL_LINE_Y_PADDING = 9;
const HORIZONTAL_LINE_X_PADDING = 25;

interface MeshProps {
  width: number;
  height: number;
  canvasHeight: number;
  canvasWidth: number;
  verticalLabels: string[];
  depthLabels: string[];
}

class Mesh extends React.Component<MeshProps> {
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  drawingTools: IMeshDrawingTools;

  constructor(props: MeshProps) {
    super(props);
  }

  componentDidMount() {
    this.canvasCtx = this.canvas!.getContext('2d');
    defineCanvasScale(
      this.canvasCtx,
      this.canvas,
      this.props.canvasWidth,
      this.props.canvasHeight
    );

    window.requestAnimationFrame(() => {
      this.renderCanvas();
      this.forceUpdate();
    });
    this.drawingTools = drawMeshElements(this.canvasCtx!);
  }

  componentWillReceiveProps({canvasWidth, canvasHeight}: MeshProps) {
    window.requestAnimationFrame(() => {
      defineCanvasScale(this.canvasCtx, this.canvas, canvasWidth, canvasHeight);
      this.renderCanvas();
      this.forceUpdate();
    });
  }

  drawMid = () => {
    this.drawingTools.drawMid(this.props.width / 2, this.props.height);
  };

  drawVerticalLines = () => {
    const stepVertical = this.props.width / chart.mesh.verticalLinesAmount;
    const startVertical = stepVertical / 2;
    for (
      let startX = startVertical, index = 0;
      startX < this.props.width;
      startX += stepVertical, index++
    ) {
      this.drawingTools.drawVerticalLine(startX, this.props.height);
    }
  };

  drawHorizontalLines = () => {
    const stepHorizontal = this.props.height / chart.mesh.horizontalLinesAmount;
    const startHorizontal = stepHorizontal / 2;
    for (
      let startY = startHorizontal;
      startY < this.props.height;
      startY += stepHorizontal
    ) {
      this.drawingTools.drawHorizontalLine(this.props.width, startY);
    }
  };

  drawVerticalLabels = () => {
    const stepVertical = this.props.width / chart.mesh.verticalLinesAmount;
    const startVertical = stepVertical / 2;
    const labels = this.props.verticalLabels;
    if (labels.length) {
      const startY = this.props.height + VERTICAL_LINE_PADDING;
      for (
        let startX = startVertical, index = 0;
        startX < this.props.width;
        startX += stepVertical, index++
      ) {
        this.drawingTools.drawLabel(
          labels[index],
          startX,
          startY,
          `bold ${chart.mesh.verticalFontSize}px ${chart.mesh.fontFamily}`
        );
      }
    }
  };

  drawHorizontalLabels = () => {
    const stepHorizontal = this.props.height / chart.mesh.horizontalLinesAmount;
    const startHorizontal = stepHorizontal / 2 + HORIZONTAL_LINE_Y_PADDING;
    const labels = this.props.depthLabels;
    if (labels.length) {
      const startX = this.props.width + HORIZONTAL_LINE_X_PADDING;
      for (
        let startY = startHorizontal, index = 0;
        startY < this.props.height;
        startY += stepHorizontal, index++
      ) {
        this.drawingTools.drawLabel(
          labels[index],
          startX,
          startY - chart.mesh.horizontalFontSize / 2,
          `bold ${chart.mesh.horizontalFontSize}px ${chart.mesh.fontFamily}`
        );
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
