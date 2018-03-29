import * as React from 'react';

import {Circle, Line} from 'react-konva';

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
  borders: number[] = [];
  width: number = 1080;
  height: number = 500;

  line: number[] = [0, 0, 0, this.height];

  constructor(props: PointerProps) {
    super(props);
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
        points={this.line}
        closed={false}
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
    this.drawPointer();
    return this.graphics;
  }
}

export default Pointer;
