import {connect} from '../connect';
import OrderList from './OrderList';

const ConnectedOrderList = connect(
  ({orderListStore: {allOrderLists: orders}}) => ({
    orders
  }),
  OrderList
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem/OrderListItem';
