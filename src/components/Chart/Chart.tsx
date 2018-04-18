import * as React from 'react';
import {ChartContainer, ChartWrapper, ResetButton} from './styles';

export interface ChartProps {
  onReset: () => void;
}

const Chart: React.SFC<ChartProps> = ({onReset}) => (
  <ChartWrapper>
    <ResetButton onClick={onReset}>Reset</ResetButton>
    <ChartContainer id="tv_chart_container" />
  </ChartWrapper>
);

export default Chart;
