import {connect} from '../../connect';
import ChartWrapper from './ChartWrapper';

// tslint:disable:object-literal-sort-keys
const ConnectedChart = connect(
  ({depthChartStore: {asks, bids, mid}, uiStore: {selectedInstrument}}) => {
    const midPrice = mid();

    return {
      asks,
      bids,
      mid: midPrice,
      selectedInstrument
    };
  },
  ChartWrapper
);

export default ConnectedChart;
export {default as ChartWrapper} from './ChartWrapper';
