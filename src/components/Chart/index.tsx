import {connect} from '../connect';
import Chart, {ChartProps} from './Chart';

const ConnectedChart = connect<ChartProps>(
  ({chartStore, start}) => ({
    onReset: chartStore.resetToDefault,
    renderChart: start
  }),
  Chart
);

export {ConnectedChart as Chart};
