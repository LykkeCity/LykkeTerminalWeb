import {connect} from '../connect';
import OrderList from './OrderList';

const ConnectedOrderList = connect(
  ({
    orderListStore: {limitOrders: orders},
    orderStore: {cancelAll, cancelOrder}
  }) => ({
    cancelAll,
    cancelOrder,
    orders
  }),
  OrderList
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
