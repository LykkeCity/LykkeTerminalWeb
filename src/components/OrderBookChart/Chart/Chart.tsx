import * as React from 'react';

import Konva from 'konva';
import {Layer, Stage} from 'react-konva';

import Asks from './Asks';
import Bids from './Bids';
import Mesh from './Mesh';

import {ChartProps} from './Models';

class Chart extends React.Component<ChartProps> {
  width = 1125;
  height = 549;

  constructor(props: ChartProps) {
    super(props);
  }

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };

  render() {
    return (
      <Stage width={this.width} height={this.height}>
        <Layer clearBeforeDraw={true}>
          <Mesh
            asks={this.props.asks}
            bids={this.props.bids}
            mid={this.props.mid}
          />
          <Asks
            asks={this.props.asks}
            bids={this.props.bids}
            mid={this.props.mid}
          />
          <Bids
            asks={this.props.asks}
            bids={this.props.bids}
            mid={this.props.mid}
          />
        </Layer>
      </Stage>
    );
  }
}

export default Chart;
