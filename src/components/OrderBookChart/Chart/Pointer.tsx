import * as React from 'react';

import {Line} from 'react-konva';

import chart from './chartConstants';

interface PointerProps {
  points: number[];
  borders: number[];
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

    const yIndex =
      xPoints.findIndex(value => {
        return value > mouseX;
      }) *
        2 +
      1;

    return this.points[yIndex];
  };

  updateLine = () => {
    this.calcY = this.calculateCurrentY(this.mouseX);
    this.line = [this.mouseX, this.calcY, this.mouseX, this.height];
  };

  handleMouseMove = (event: any) => {
    this.mouseX = event.target.getStage().getPointerPosition().x;
    this.forceUpdate();
  };

  handleMouseLeave = (event: any) => {
    this.mouseX = -1;
    this.calcY = -1;
    this.forceUpdate();
  };

  drawPointer = () => {
    this.graphics.push(
      <Line
        points={[
          this.borders[0],
          this.borders[1],
          this.borders[0],
          0,
          this.width,
          0,
          this.width,
          this.height
        ]}
        closed={true}
        // tslint:disable-next-line:jsx-no-lambda
        onMouseMove={this.handleMouseMove}
        onMouseOver={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      />,
      <Line
        points={this.line}
        closed={false}
        stroke={'#ff0000'}
        strokeWidth={chart.strokeWidth}
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
