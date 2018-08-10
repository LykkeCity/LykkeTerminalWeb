import * as React from 'react';

import Measure from 'react-measure';

import {Chart, Mesh} from './index';

import {ChartContainer, LevelContainer} from '../styles';

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

  handleResize = (contentRect: any) => {
    this.width = Math.ceil(contentRect.client!.width);
    this.height = Math.ceil(contentRect.client!.height);
    this.props.setWidth(this.width);
    this.props.setHeight(this.height);
    this.forceUpdate();
  };

  render() {
    return (
      <Measure
        // tslint:disable-next-line:jsx-boolean-value
        client
        // tslint:disable-next-line:jsx-no-lambda
        onResize={this.handleResize}
      >
        {({measureRef}) => (
          <div style={{height: '100%'}} ref={measureRef}>
            <ChartContainer style={{height: this.height, width: this.width}}>
              <LevelContainer>
                {this.props.selectedInstrument && <Mesh />}
              </LevelContainer>
              <LevelContainer>
                {this.props.selectedInstrument && <Chart />}
              </LevelContainer>
            </ChartContainer>
          </div>
        )}
      </Measure>
    );
  }
}

export default ChartWrapper;
