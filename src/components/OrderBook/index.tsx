import {connect} from '../connect';
import OrderBook from './OrderBook';

interface OrderBookInterface {
  orders?: any[];
}

interface OrderBookItemInterface {
  ask: number;
  bid: number;
  id: number;
  price: number;
}

const ConnectedOrderBook = connect(
  ({orderBookStore: {allOrders: orders}}) => ({
    orders
  }),
  OrderBook
);

export {OrderBookInterface};
export {OrderBookItemInterface};
export {ConnectedOrderBook as OrderBook};
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
