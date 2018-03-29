import * as React from 'react';

import {Line} from 'react-konva';

import chart from './chartConstants';

interface PointerProps {
  points: number[];
}

class Pointer extends React.Component<PointerProps> {
  graphics: any = [];
  points: number[] = [];
  width: number = 1080;
  height: number = 500;

  line: number[] = [];

  constructor(props: PointerProps) {
    super(props);
  }

  handleMouseMove = (event: any) => {
    const mouseX = event.target.getStage().getPointerPosition().x;
    this.line = [mouseX, 0, mouseX, this.height];
    this.forceUpdate();
  };

  handleMouseLeave = (event: any) => {
    this.line = [];
    this.forceUpdate();
  };

  drawPointer = () => {
    const points = this.props.points.concat([this.width, this.height]);
    this.graphics.push(
      <Line
        points={points}
        closed={true}
        // tslint:disable-next-line:jsx-no-lambda
        onMouseMove={this.handleMouseMove}
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
  };

  render() {
    this.initialize();
    this.drawPointer();
    return this.graphics;
  }
}

export default Pointer;
