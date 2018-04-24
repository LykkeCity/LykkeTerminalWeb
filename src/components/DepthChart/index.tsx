import {pathOr} from 'rambda';
import {connect} from '../connect';
import DepthChart from './DepthChart';

// tslint:disable:object-literal-sort-keys
const ConnectedDepthChart = connect(
  ({
    depthChartStore: {
      asks,
      bids,
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
      asks,
      bids,
      mid: midPrice,
      spread: priceSpread,
      lastTradePrice: lastPrice,
      span,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan
    };
  },
  DepthChart
);

export default ConnectedDepthChart;
export {default as DepthChart} from './DepthChart';
