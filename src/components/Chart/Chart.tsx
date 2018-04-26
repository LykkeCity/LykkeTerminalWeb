import * as React from 'react';

import {UiStore} from '../../stores';

import {InstrumentModel} from '../../models';
import {
  ChartContainer,
  ChartWrapper,
  ResetButton,
  TransparentDiv
} from './styles';

export interface ChartProps {
  onReset: () => void;
  renderChart: any;
  fetchPublicInstruments: any;
  getInstrumentById: (instrumentId: string) => InstrumentModel | undefined;
}

class Chart extends React.Component<ChartProps> {
  constructor(props: ChartProps) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPublicInstruments().then(() => {
      this.props.renderChart(
        this.props.getInstrumentById(UiStore.DEFAULT_INSTRUMENT)
      );
    });
  }

  render() {
    return (
      <ChartWrapper>
        <ResetButton onClick={this.props.onReset}>Reset</ResetButton>
        <ChartContainer id="tv_chart_container" />
        <TransparentDiv id="transparentDiv" />
      </ChartWrapper>
    );
  }
}
export default Chart;
