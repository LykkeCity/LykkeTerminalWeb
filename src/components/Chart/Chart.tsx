import * as React from 'react';
import {ChartContainer, ChartWrapper, TransparentDiv} from './styles';

class Chart extends React.Component {
  render() {
    return (
      <ChartWrapper>
        <ChartContainer id="tv_chart_container" />
        <TransparentDiv id="transparentDiv" />
      </ChartWrapper>
    );
  }
}
export default Chart;
