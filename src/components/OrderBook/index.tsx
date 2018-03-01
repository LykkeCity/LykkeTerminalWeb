import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBook from './OrderBook';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBook = connect(
  ({
    modalStore: {addModal},
    orderBookStore: {asks, bids, mid},
    uiStore: {selectedInstrument, stateFns},
    orderStore: {cancelOrder}
  }) => {
    const accuracy = pathOr(0, ['baseAsset', 'accuracy'], selectedInstrument);
    // prettier-ignore
    const invertedAccuracy = pathOr(0, ['quoteAsset', 'accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(invertedAccuracy);
    return {
      addModal,
      asks,
      bids,
      cancelOrder,
      mid: midPrice,
      accuracy,
      invertedAccuracy,
      stateFns
    };
  },
  OrderBook
);

export default ConnectedOrderBook;
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
