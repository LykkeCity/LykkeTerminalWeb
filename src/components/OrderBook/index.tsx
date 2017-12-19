import {connect} from '../connect';
import OrderBook from './OrderBook';

const ConnectedOrderBook = connect(
  ({orderBookStore: {allOrders: orders}}) => ({
    orders
  }),
  OrderBook
);

export {ConnectedOrderBook as OrderBook};
