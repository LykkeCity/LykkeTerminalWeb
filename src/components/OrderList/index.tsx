import {connect} from '../connect';
import OrderList from './OrderList';

export interface OrderActions {
  onCancel?: (id: string) => void;
}

const ConnectedOrderList = connect(
  ({orderListStore: {limitOrders: orders, cancelOrder: onCancel}}) => ({
    onCancel,
    orders
  }),
  OrderList
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
