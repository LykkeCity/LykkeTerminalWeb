import {connect} from '../connect';
import OrderBook from './OrderBook';

const ConnectedOrderBook = connect(
  ({
    orderBookStore: {bestAsks, bestBids, mid},
    uiStore: {selectedInstrument}
  }) => ({
    asks: bestAsks(10),
    bids: bestBids(10),
    mid: mid().toFixed(2)
  }),
  OrderBook
);

export default ConnectedOrderBook;
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
