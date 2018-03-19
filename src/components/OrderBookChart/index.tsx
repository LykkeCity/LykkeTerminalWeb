import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBookChart from './OrderBookChart';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBook = connect(
  ({
    modalStore: {addModal},
    orderBookStore: {asks, bids, mid, seedSpan, span, nextSpan, prevSpan},
    uiStore: {selectedInstrument, stateFns},
    orderStore: {cancelOrder, updatePrice, updatePriceAndDepth}
  }) => {
    const volumeAccuracy = pathOr(
      0,
      ['baseAsset', 'accuracy'],
      selectedInstrument
    );
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(priceAccuracy);
    return {
      addModal,
      asks,
      bids,
      cancelOrder,
      mid: midPrice,
      volumeAccuracy,
      priceAccuracy,
      updatePrice,
      updatePriceAndDepth,
      stateFns,
      span,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan
    };
  },
  OrderBookChart
);

export default ConnectedOrderBook;
export {default as OrderBookChart} from './OrderBookChart';
