import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBookChart from './OrderBookChart';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBookChart = connect(
  ({
    orderBookChartStore: {
      mid,
      spread,
      lastTradePrice,
      span,
      nextSpan,
      prevSpan
    },
    uiStore: {selectedInstrument}
  }) => {
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const accuracy = 3;

    const midPrice = mid().toFixed(priceAccuracy);
    const priceSpread = spread().toFixed(accuracy);
    const lastPrice = lastTradePrice().toFixed(accuracy);
    return {
      mid: midPrice,
      spread: priceSpread,
      lastTradePrice: lastPrice,
      span,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan
    };
  },
  OrderBookChart
);

export default ConnectedOrderBookChart;
export {default as OrderBookChart} from './OrderBookChart';
