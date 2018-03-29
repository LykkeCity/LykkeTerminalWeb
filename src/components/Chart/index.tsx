import {connect} from '../connect';
import Chart from './Chart';

const connectedChart = connect(
  ({chartStore}) => ({
    onReset: chartStore.resetToDefault
  }),
  Chart
);

export {connectedChart as Chart};
