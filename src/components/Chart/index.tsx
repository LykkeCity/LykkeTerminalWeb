import {connect} from '../connect';
import Chart, {ChartProps} from './Chart';

const ConnectedChart = connect<ChartProps>(
  ({chartStore, referenceStore, uiStore}) => ({
    onReset: chartStore.resetToDefault,
    renderChart: chartStore.renderChart,
    fetchPublicInstruments: referenceStore.fetchPublicInstruments,
    getInstrumentById: referenceStore.getInstrumentById
  }),
  Chart
);

export {ConnectedChart as Chart};
