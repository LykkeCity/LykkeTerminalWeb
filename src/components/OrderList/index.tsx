import {OrderModel} from '../../models';
import {connect} from '../connect';
import OrderList from './OrderList';

export interface OrderListProps {
  orders?: OrderModel[];
}

export interface OrderActions {
  onCancel: (id: string) => void;
}

export interface OrderListItemProps extends OrderModel, OrderActions {}

const ConnectedOrderList = connect(
  ({orderListStore: {limitOrders: orders}}) => ({
    orders
  }),
  OrderList
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
