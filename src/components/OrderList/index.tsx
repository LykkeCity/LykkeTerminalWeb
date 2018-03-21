import {withAuth} from '../Auth';
import {connect} from '../connect';
import OrderList from './OrderList';

export interface OrderActions {
  cancelOrder?: (id: string) => void;
}

export interface OrderListProps {
  onEdit: any;
}

const ConnectedOrderList = connect(
  ({
    orderListStore: {limitOrders: orders},
    orderStore: {cancelOrder},
    modalStore: {addModal},
    authStore: {isAuth}
  }) => ({
    addModal,
    cancelOrder,
    orders,
    isAuth
  }),
  withAuth(OrderList)
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
