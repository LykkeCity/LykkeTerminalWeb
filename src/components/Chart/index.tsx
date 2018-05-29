import {connect} from '../connect';
import Chart, {ChartProps} from './Chart';

const ConnectedChart = connect<ChartProps>(
  ({chartStore, referenceStore}) => ({
    onReset: chartStore.resetToDefault,
    renderChart: chartStore.renderChart
  }),
  Chart
);

export {ConnectedChart as Chart};
