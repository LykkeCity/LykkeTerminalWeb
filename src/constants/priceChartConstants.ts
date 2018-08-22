export const DEFAULT_SCALE = 50;
export const CHART_ID = 'price-chart';

export interface IchartInterval {
  label: string;
  description: string;
  value: string;
  timeUnitQty: number;
}

export interface IchartIndicator {
  label: string;
  value: string;
  isActive: boolean;
  type: string;
}

export const chartInterval = {
  sec: {label: '1s', description: '1 second', value: 'sec', timeUnitQty: 1},
  minute: {
    label: '1m',
    description: '1 minute',
    value: 'minute',
    timeUnitQty: 1
  },
  min5: {label: '5m', description: '5 minutes', value: 'min5', timeUnitQty: 5},
  min15: {
    label: '15m',
    description: '15 minutes',
    value: 'min15',
    timeUnitQty: 15
  },
  min30: {
    label: '30m',
    description: '30 minutes',
    value: 'min30',
    timeUnitQty: 30
  },
  hour: {label: '1h', description: '1 hour', value: 'hour', timeUnitQty: 1},
  hour4: {label: '4h', description: '4 hour', value: 'hour4', timeUnitQty: 4},
  hour6: {label: '6h', description: '6 hour', value: 'hour6', timeUnitQty: 6},
  hour12: {
    label: '12h',
    description: '12 hour',
    value: 'hour12',
    timeUnitQty: 12
  },
  day: {label: '1D', description: '1 day', value: 'day', timeUnitQty: 1},
  week: {label: '1W', description: '1 week', value: 'week', timeUnitQty: 1},
  month: {label: '1M', description: '1 month', value: 'month', timeUnitQty: 1}
};

export const chartIndicators = {
  volume: {label: 'Volume', value: 'volume', isActive: true, type: 'inner'},
  macd: {label: 'MACD', value: 'macd', isActive: false, type: 'external'},
  ma: {label: 'Moving Averages', value: 'ma', isActive: false, type: 'inner'}
};
