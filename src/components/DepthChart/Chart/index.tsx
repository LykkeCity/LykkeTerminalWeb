import {pathOr} from 'rambda';
import {connect} from '../../connect';
import ChartWrapper from './ChartWrapper';

// tslint:disable:object-literal-sort-keys
const ConnectedChart = connect(
  ({depthChartStore: {asks, bids, mid}, uiStore: {selectedInstrument}}) => {
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const midPrice = mid();

    return {
      asks,
      bids,
      mid: midPrice,
      priceAccuracy,
      selectedInstrument
    };
  },
  ChartWrapper
);

export default ConnectedChart;
export {default as ChartWrapper} from './ChartWrapper';
