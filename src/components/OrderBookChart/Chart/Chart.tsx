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
    const {asks, bids, mid, baseAsset, quoteAsset} = this.props;

    return (
      <Stage width={this.width} height={this.height}>
        <FastLayer clearBeforeDraw={true}>
          <Mesh
            asks={asks}
            bids={bids}
            mid={mid}
            baseAsset={baseAsset}
            quoteAsset={quoteAsset}
          />
        </FastLayer>
        <Layer>
          <Asks
            asks={asks}
            bids={bids}
            mid={mid}
            baseAsset={baseAsset}
            quoteAsset={quoteAsset}
          />
          <Bids
            asks={asks}
            bids={bids}
            mid={mid}
            baseAsset={baseAsset}
            quoteAsset={quoteAsset}
          />
        </Layer>
      </Stage>
    );
  }
}

export default Chart;
