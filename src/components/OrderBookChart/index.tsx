import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBookChart from './OrderBookChart';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBookChart = connect(
  ({
    orderBookChartStore: {mid, span, nextSpan, prevSpan},
    uiStore: {selectedInstrument}
  }) => {
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(priceAccuracy);
    return {
      mid: midPrice,
      span,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan
    };
  },
  OrderBookChart
);

export default ConnectedOrderBookChart;
export {default as OrderBookChart} from './OrderBookChart';
