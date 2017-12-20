import {connect} from '../connect';
import OrderList from './OrderList';

export interface OrderListInterface {
  orders?: any[];
}

export interface OrderListItemInterface {
  createdDate: Date;
  currentPrice: number;
  currentPriceSide: number;
  expiryDate: string;
  id: number;
  orderId: number;
  openPrice: number;
  side: string;
  symbol: string;
  volume: number;
}

const ConnectedOrderList = connect(
  ({orderListStore: {allOrderLists: orders}}) => ({
    orders
  }),
  OrderList
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem/OrderListItem';
