import {connect} from '../connect';
import Chart, {ChartProps} from './Chart';

const ConnectedChart = connect<ChartProps>(
  ({chartStore}) => ({
    onReset: chartStore.resetToDefault
  }),
  Chart
);

export {ConnectedChart as Chart};
