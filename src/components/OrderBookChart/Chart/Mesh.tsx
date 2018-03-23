import * as React from 'react';

import {Line} from 'react-konva';

class Mesh extends React.Component {
  lines: any = [];

  width = 1125;
  height = 549;

  color = '#8c94a0';
  dash = [1, 3];
  strikeWidth = 1;

  stepVertical = 140;
  stepHorizontal = 40;

  startVertical = this.stepVertical / 2;
  startHorizontal = this.stepHorizontal / 2;

  drawMid = () => {
    this.lines.push(
      <Line
        points={[this.width / 2, 0, this.width / 2, this.height]}
        closed={true}
        stroke={this.color}
        strokeWidth={this.strikeWidth}
      />
    );
  };

  drawVertical = () => {
    for (let i = this.startVertical; i < this.width; i += this.stepVertical) {
      this.lines.push(
        <Line
          points={[i, 0, i, this.height]}
          closed={true}
          stroke={this.color}
          strokeWidth={this.strikeWidth}
          dash={this.dash}
          opacity={0.6}
        />
      );
    }
  };

  drawHorizontal = () => {
    for (
      let i = this.startHorizontal;
      i < this.height;
      i += this.stepHorizontal
    ) {
      this.lines.push(
        <Line
          points={[0, i, this.width, i]}
          closed={true}
          stroke={this.color}
          strokeWidth={this.strikeWidth}
          dash={this.dash}
          opacity={0.6}
        />
      );
    }
  };

  render() {
    this.lines = [];
    this.drawMid();
    this.drawHorizontal();
    this.drawVertical();

    return this.lines;
  }
}

export default Mesh;
