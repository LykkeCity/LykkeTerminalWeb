import * as React from 'react';

import {FastLayer, Layer, Stage} from 'react-konva';

import Measure from 'react-measure';

import {Chart, Mesh} from './index';

import {ChartProps} from './Models';

import chart from './chartConstants';

class ChartWrapper extends React.Component<ChartProps> {
  width: number = -1;
  height: number = -1;

  constructor(props: ChartProps) {
    super(props);
  }

  render() {
    return (
      <Measure
        // tslint:disable-next-line:jsx-boolean-value
        client
        // tslint:disable-next-line:jsx-no-lambda
        onResize={contentRect => {
          this.width = Math.ceil(contentRect.client!.width);
          this.height = Math.ceil(contentRect.client!.height);
          this.forceUpdate();
        }}
      >
        {({measureRef}) => (
          <div style={{height: '100%'}} ref={measureRef}>
            <Stage width={this.width} height={this.height}>
              <FastLayer>
                {this.props.selectedInstrument && (
                  <Mesh
                    width={this.width - chart.labelsWidth}
                    height={this.height - chart.labelsHeight}
                  />
                )}
              </FastLayer>
              <Layer>
                {this.props.selectedInstrument && (
                  <Chart
                    width={this.width - chart.labelsWidth}
                    height={this.height - chart.labelsHeight}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        )}
      </Measure>
    );
  }
}

export default ChartWrapper;
