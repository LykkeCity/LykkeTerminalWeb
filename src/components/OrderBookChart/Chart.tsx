import * as React from 'react';

import Konva from 'konva';
import {Layer, Line, Stage, Text} from 'react-konva';

class Mesh extends React.Component {
  width = 1125;
  height = 549;

  start = 0;

  stepVertical = 160;
  stepHorizontal = 60;

  render() {
    const lines = [];
    for (let i = this.stepVertical; i < this.width; i += this.stepVertical) {
      lines.push(
        <Line
          points={[i, 0, i, this.height]}
          closed={true}
          stroke={'#8c94a0'}
          strokeWidth={2}
          dash={[1, 3]}
        />
      );
    }
    for (
      let i = this.stepHorizontal;
      i < this.height;
      i += this.stepHorizontal
    ) {
      lines.push(
        <Line
          points={[0, i, this.width, i]}
          closed={true}
          stroke={'#8c94a0'}
          strokeWidth={1}
          dash={[1, 3]}
        />
      );
    }
    return lines;
  }
}

// tslint:disable-next-line:max-classes-per-file
class Chart extends React.Component {
  state = {
    color: 'green'
  };
  width = 1125;
  height = 549;

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };

  render() {
    return (
      <Stage width={this.width} height={this.height}>
        <Layer>
          <Text text={window.innerHeight.toString()} />
          <Mesh />
        </Layer>
      </Stage>
    );
  }
}

export default Chart;
