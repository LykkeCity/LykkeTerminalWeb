import {pathOr} from 'rambda';
import {connect} from '../../connect';
import Chart from './Chart';

// tslint:disable:object-literal-sort-keys
const ConnectedChart = connect(
  ({orderBookChartStore: {asks, bids, mid}, uiStore: {selectedInstrument}}) => {
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(priceAccuracy);
    return {
      asks,
      bids,
      mid: midPrice
    };
  },
  Chart
);

export default ConnectedChart;
export {default as Chart} from './Chart';
