import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBook from './OrderBook';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBook = connect(
  ({orderBookStore: {asks, bids, mid}, uiStore: {selectedInstrument}}) => {
    const accuracy = pathOr(0, ['baseAsset', 'accuracy'], selectedInstrument);
    // prettier-ignore
    const invertedAccuracy = pathOr(0, ['quoteAsset', 'accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(invertedAccuracy);
    return {
      asks,
      bids,
      mid: midPrice,
      accuracy,
      invertedAccuracy
    };
  },
  OrderBook
);

export default ConnectedOrderBook;
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
