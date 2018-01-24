import {connect} from '../connect';
import OrderList from './OrderList';

export interface OrderActions {
  cancelOrder?: (id: string) => void;
}

const ConnectedOrderList = connect(
  ({orderListStore: {limitOrders: orders}, orderStore: {cancelOrder}}) => ({
    cancelOrder,
    orders
  }),
  OrderList
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
