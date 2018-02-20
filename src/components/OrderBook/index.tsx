import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBook from './OrderBook';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBook = connect(
  ({
    orderBookStore: {bestAsks, bestBids, mid},
    uiStore: {selectedInstrument}
  }) => ({
    asks: bestAsks(10),
    bids: bestBids(10),
    mid: mid().toFixed(2),
    accuracy: pathOr(0, ['baseAsset', 'accuracy'], selectedInstrument)
  }),
  OrderBook
);

export default ConnectedOrderBook;
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
