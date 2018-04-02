import * as React from 'react';
import {HeaderItem} from '../Header/Header';
import {
  InstrumentPerformanceFigureLabel,
  InstrumentPerformanceFigureValue,
  StyledInstrumentPerformance,
  StyledInstrumentPerformanceFigure
} from './styles';

const colorFromChange = (change: number) =>
  Number.isFinite(change) ? (change > 0 ? '#13b72a' : '#ff3e2e') : undefined;

const mapToPercentageWithAccuracy = (acc: number) => (val: number) =>
  Math.abs(val)
    .toFixed(acc)
    .concat('%');

export interface InstrumentPerformanceProps {
  lastPrice: number;
  change: number;
  high: number;
  low: number;
  volume: number;
  instrumentAccuracy: number;
  baseAssetAccuracy: number;
}

interface InstrumentPerformanceFigureProps {
  label: string;
  value: number;
  accuracy: number;
  color?: string;
  valueFormatter?: (value: number | string) => string;
}

const InstrumentPerformanceFigure: React.SFC<
  InstrumentPerformanceFigureProps
> = ({label = '', value, accuracy, color, valueFormatter}) => (
  <HeaderItem>
    <StyledInstrumentPerformanceFigure>
      <InstrumentPerformanceFigureValue color={color}>
        {Number.isFinite(value)
          ? valueFormatter ? valueFormatter(value) : value.toFixed(accuracy)
          : '---'}
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
  volume,
  instrumentAccuracy = 2,
  baseAssetAccuracy = 2
}) => {
  const mapToPercentageWithInstrumentAccuracy = mapToPercentageWithAccuracy(
    instrumentAccuracy
  );
  return (
    <StyledInstrumentPerformance>
      <InstrumentPerformanceFigure
        label="Last price"
        value={lastPrice}
        accuracy={instrumentAccuracy}
      />
      <InstrumentPerformanceFigure
        label="Change (24h)"
        value={Math.abs(change)}
        valueFormatter={mapToPercentageWithInstrumentAccuracy}
        color={colorFromChange(change)}
        accuracy={instrumentAccuracy}
      />
      <InstrumentPerformanceFigure
        label="High (24h)"
        value={high}
        accuracy={instrumentAccuracy}
      />
      <InstrumentPerformanceFigure
        label="Low (24h)"
        value={low}
        accuracy={instrumentAccuracy}
      />
      <InstrumentPerformanceFigure
        label="Volume (24h)"
        value={volume}
        accuracy={baseAssetAccuracy}
      />
    </StyledInstrumentPerformance>
  );
};

export default InstrumentPerformance;
