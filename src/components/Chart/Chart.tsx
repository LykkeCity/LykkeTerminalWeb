import * as React from 'react';

import {
  ChartContainer,
  ChartWrapper,
  ResetButton,
  TransparentDiv
} from './styles';

export interface ChartProps {
  onReset: () => void;
  renderChart: any;
}

class Chart extends React.Component<ChartProps> {
  constructor(props: ChartProps) {
    super(props);
  }

  componentDidMount() {
    this.props.renderChart();
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
