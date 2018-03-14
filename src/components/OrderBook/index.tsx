import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBook from './OrderBook';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBook = connect(
  ({
    modalStore: {addModal},
    orderBookStore: {asks, bids, mid, initialSpan, span, incSpan, decSpan},
    uiStore: {selectedInstrument, stateFns},
    orderStore: {
      cancelOrder,
      updatePrice,
      updatePriceAndDepth,
      setIsOrderBookClicked
    }
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
      setIsOrderBookClicked,
      span,
      onIncSpan: incSpan,
      onDecSpan: decSpan
    };
  },
  OrderBook
);

export default ConnectedOrderBook;
export {default as OrderBookItem} from './OrderBookItem';
