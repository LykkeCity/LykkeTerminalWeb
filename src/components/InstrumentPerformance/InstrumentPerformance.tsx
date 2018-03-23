import * as React from 'react';
import {HeaderItem} from '../Header/Header';
import {
  InstrumentPerformanceFigureLabel,
  InstrumentPerformanceFigureValue,
  StyledInstrumentPerformance,
  StyledInstrumentPerformanceFigure
} from './styles';

const colorFromChange = (change: number) =>
  change > 0 ? '#13b72a' : '#ff3e2e';

export interface InstrumentPerformanceProps {
  lastPrice: number;
  change: number;
  high: number;
  low: number;
  volume: number;
}

interface InstrumentPerformanceFigureProps {
  label: string;
  value: number;
  color?: string;
}

const InstrumentPerformanceFigure: React.SFC<
  InstrumentPerformanceFigureProps
> = ({label = '', value = 0, ...rest}) => (
  <HeaderItem>
    <StyledInstrumentPerformanceFigure>
      <InstrumentPerformanceFigureValue {...rest}>
        {value && isFinite(value) && value.toFixed(2)}
      </InstrumentPerformanceFigureValue>
      <InstrumentPerformanceFigureLabel>
        {label}
      </InstrumentPerformanceFigureLabel>
    </StyledInstrumentPerformanceFigure>
  </HeaderItem>
);

const InstrumentPerformance: React.SFC<InstrumentPerformanceProps> = ({
  lastPrice,
  change,
  high,
  low,
  volume
}) => (
  <StyledInstrumentPerformance>
    <InstrumentPerformanceFigure label="Last price" value={lastPrice} />
    <InstrumentPerformanceFigure
      label="Change, %"
      value={Math.abs(change)}
      color={colorFromChange(change)}
    />
    <InstrumentPerformanceFigure label="High" value={high} />
    <InstrumentPerformanceFigure label="Low" value={low} />
    <InstrumentPerformanceFigure label="Volume" value={volume} />
  </StyledInstrumentPerformance>
);

export default InstrumentPerformance;
