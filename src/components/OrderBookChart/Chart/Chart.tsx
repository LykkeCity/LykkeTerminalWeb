import * as React from 'react';

import {FastLayer, Layer, Stage} from 'react-konva';

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

  render() {
    return (
      <Stage width={this.width} height={this.height}>
        <FastLayer clearBeforeDraw={true}>
          <Mesh
            asks={this.props.asks}
            bids={this.props.bids}
            mid={this.props.mid}
          />
        </FastLayer>
        <Layer>
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
