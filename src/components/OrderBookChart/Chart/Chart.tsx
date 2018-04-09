import * as React from 'react';

import {observable} from 'mobx';

import {FastLayer, Layer, Stage} from 'react-konva';

import Measure from 'react-measure';

import Asks from './Asks';
import Bids from './Bids';
import Mesh from './Mesh';

import {ChartProps} from './Models';

import chart from './chartConstants';

class Chart extends React.Component<ChartProps> {
  @observable width: number;
  @observable height: number;

  constructor(props: ChartProps) {
    super(props);
  }

  render() {
    const {asks, bids, mid, baseAsset, quoteAsset} = this.props;

    return (
      <Measure
        // tslint:disable-next-line:jsx-boolean-value
        bounds
        // tslint:disable-next-line:jsx-no-lambda
        onResize={contentRect => {
          this.width = contentRect.bounds!.width;
          this.height = chart.height;
        }}
      >
        {({measureRef}) => (
          <div ref={measureRef}>
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
          </div>
        )}
      </Measure>
    );
  }
}

export default Chart;
