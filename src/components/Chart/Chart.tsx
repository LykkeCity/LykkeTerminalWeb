import * as React from 'react';

import {
  ChartContainer,
  ChartWrapper,
  ResetButton,
  TransparentDiv
} from './styles';

export interface ChartProps {
  onReset: () => void;
}

const Chart: React.SFC<ChartProps> = ({onReset}) => (
  <ChartWrapper>
    <ResetButton onClick={onReset}>Reset</ResetButton>
    <ChartContainer id="tv_chart_container" />
    <TransparentDiv id="transparentDiv" />
  </ChartWrapper>
);

export default Chart;
