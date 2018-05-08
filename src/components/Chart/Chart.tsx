import * as React from 'react';
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
  selectedInstrument: InstrumentModel | null;
}

class Chart extends React.Component<ChartProps> {
  constructor(props: ChartProps) {
    super(props);
  }

  componentDidMount() {
    if (this.props.selectedInstrument) {
      this.props.renderChart(this.props.selectedInstrument);
    }
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
