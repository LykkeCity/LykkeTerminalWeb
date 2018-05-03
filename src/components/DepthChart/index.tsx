import {pathOr} from 'rambda';
import {connect} from '../connect';
import DepthChart from './DepthChart';

const ConnectedDepthChart = connect(
  ({
    depthChartStore: {mid, spread, span, nextSpan, prevSpan},
    priceStore: {lastTradePrice},
    uiStore: {selectedInstrument}
  }) => {
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const accuracy = 3;

    const midPrice = mid().toFixed(priceAccuracy);
    const priceSpread = spread().toFixed(accuracy);
    return {
      mid: midPrice,
      spread: priceSpread,
      lastTradePrice,
      span,
      priceAccuracy,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan
    };
  },
  DepthChart
);

export default ConnectedDepthChart;
export {default as DepthChart} from './DepthChart';
