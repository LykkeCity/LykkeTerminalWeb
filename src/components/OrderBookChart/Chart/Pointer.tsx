import * as React from 'react';

import {Circle, Line, Text} from 'react-konva';

import chart from './chartConstants';

interface PointerProps {
  side: string;
  points: number[];
  borders: number[];
  color: string;
}

class Pointer extends React.Component<PointerProps> {
  calcY: number;
  mouseX: number;

  graphics: any = [];

  points: number[] = [];

  width: number = 1080;
  height: number = 500;

  borders: number[] = [];
  line: number[] = [0, 0, 0, this.height];
  modal: number[] = [];
  titleX: number;
  titleY: number;
  modalLine: number[] = [];

  constructor(props: PointerProps) {
    super(props);
  }

  generateModalText(): any {
    this.titleX =
      this.mouseX -
      chart.modal.arrowWidth / 2 -
      chart.modal.widthBeforeArrow +
      chart.modal.marginLeft;
    this.titleY = this.calcY - chart.modal.arrowHeight - chart.modal.height;
    this.modalLine = [
      this.titleX,
      this.titleY + 32,
      this.titleX + (chart.modal.width - chart.modal.marginLeft * 2),
      this.titleY + 32
    ];
  }

  generateModal() {
    this.modal = [];
    const leftX =
      this.mouseX - chart.modal.arrowWidth / 2 - chart.modal.widthBeforeArrow;
    const rightX = leftX + chart.modal.width;
    const bottomY =
      this.calcY - chart.modal.shiftFromBall - chart.modal.arrowHeight;
    const topY = bottomY - chart.modal.height;
    this.modal.push(this.mouseX, this.calcY - chart.modal.shiftFromBall);
    this.modal.push(this.mouseX - chart.modal.arrowWidth / 2, bottomY);
    this.modal.push(leftX, bottomY);
    this.modal.push(leftX, topY);
    this.modal.push(rightX, topY);
    this.modal.push(rightX, bottomY);
    this.modal.push(this.mouseX + chart.modal.arrowWidth / 2, bottomY);
  }

  calculateCurrentY = (mouseX: number) => {
    const xPoints = this.points.filter((value, index, ar) => {
      return index % 2 === 0;
    });

    let xIndex = 0;

    if (this.props.side === 'asks') {
      xIndex = xPoints.findIndex(value => {
        return value > mouseX;
      });
    } else {
      xIndex = xPoints.findIndex(value => {
        return value < mouseX;
      });
    }

    const yIndex = xIndex * 2 + 1;

    return this.points[yIndex];
  };

  updateLine = () => {
    this.calcY = this.calculateCurrentY(this.mouseX);
    this.line = [this.mouseX, this.calcY, this.mouseX, this.height];
  };

  handleMouseMove = (event: any) => {
    const mouseX = event.target.getStage().getPointerPosition().x;
    if (Math.ceil(this.mouseX) !== Math.ceil(mouseX)) {
      this.mouseX = event.target.getStage().getPointerPosition().x;
      this.forceUpdate();
    }
  };

  handleMouseLeave = (event: any) => {
    this.mouseX = -chart.pointer.circleRadius;
    this.calcY = -chart.pointer.circleRadius;
    this.forceUpdate();
  };

  drawPointer = () => {
    this.graphics.push(
      <Line
        points={this.modal}
        closed={true}
        stroke={chart.modal.strokeColor}
        strokeWidth={chart.modal.strokeWidth}
        fill={chart.modal.fillColor}
      />,
      <Line
        points={this.points}
        closed={false}
        stroke={this.props.color}
        strokeWidth={chart.strokeWidth}
      />,
      <Text
        text="TEST"
        fontSize={chart.modal.title.fontSize}
        fontFamily={chart.modal.title.fontFamily}
        fontStyle={chart.modal.title.fontStyle}
        fill={chart.modal.title.fontColor}
        x={this.titleX}
        y={this.titleY}
      />,
      <Line
        points={this.modalLine}
        closed={true}
        stroke={this.props.color}
        strokeWidth={chart.strokeWidth}
        dash={chart.pointer.dash}
      />,
      <Circle
        x={this.mouseX}
        y={this.calcY}
        fill={this.props.color}
        stroke={chart.pointer.circleStrokeColor}
        radius={chart.pointer.circleRadius}
      />,
      <Line
        points={[
          this.borders[0],
          this.borders[1],
          this.borders[0],
          this.borders[3],
          this.borders[2],
          this.borders[3],
          this.borders[2],
          this.borders[1]
        ]}
        closed={true}
        onMouseMove={this.handleMouseMove}
        onMouseOver={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  };

  initialize = () => {
    this.graphics = [];
    this.borders = this.props.borders;
    this.points = this.props.points;
  };

  render() {
    this.initialize();
    this.updateLine();
    this.generateModal();
    this.generateModalText();
    this.drawPointer();
    return this.graphics;
  }
}

export default Pointer;
