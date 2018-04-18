import * as React from 'react';
import {ChartContainer, ChartWrapper, ResetButton} from './styles';

interface ChartProps {
  onReset: any;
}

class Chart extends React.Component<ChartProps> {
  render() {
    return (
      <ChartWrapper>
        <ResetButton onClick={this.props.onReset}>Reset</ResetButton>
        <ChartContainer id="tv_chart_container" />
      </ChartWrapper>
    );
  }
}

export default Chart;
