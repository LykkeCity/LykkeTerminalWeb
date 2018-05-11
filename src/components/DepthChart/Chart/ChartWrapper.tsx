import * as React from 'react';

import {FastLayer, Layer, Stage} from 'react-konva';

import Measure from 'react-measure';

import {Chart, Mesh} from './index';

export interface ChartWrapperProps {
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  selectedInstrument?: any;
}

class ChartWrapper extends React.Component<ChartWrapperProps> {
  width: number = -1;
  height: number = -1;

  constructor(props: ChartWrapperProps) {
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
          this.props.setWidth(this.width);
          this.props.setHeight(this.height);
          this.forceUpdate();
        }}
      >
        {({measureRef}) => (
          <div style={{height: '100%'}} ref={measureRef}>
            <Stage width={this.width} height={this.height}>
              <FastLayer>{this.props.selectedInstrument && <Mesh />}</FastLayer>
              <Layer>{this.props.selectedInstrument && <Chart />}</Layer>
            </Stage>
          </div>
        )}
      </Measure>
    );
  }
}

export default ChartWrapper;
