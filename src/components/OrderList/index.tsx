import {compose} from 'rambda';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import withLoader from '../Loader/withLoader';
import OrderList from './OrderList';
import {OrderListProps} from './OrderList';
import Orders from './Orders';

export const OrderCellWidth = {
  Symbol: 70,
  CancelOrder: 70,
  Id: 300,
  Side: 50,
  CreatedDate: 150
};

export interface OrderActions {
  cancelOrder?: (id: string) => void;
}

const ConnectedOrders = connect(
  ({
    orderStore: {cancelOrder},
    modalStore: {addModal},
    authStore: {isAuth}
  }) => ({
    addModal,
    cancelOrder,
    isAuth
  }),
  withAuth(Orders)
);

const ConnectedOrderList = connect<OrderListProps>(
  ({orderListStore: {limitOrders: orders, hasPendingOrders}}) => ({
    orders,
    loading: hasPendingOrders
  }),
  compose(
    withLoader<OrderListProps>(p => p.loading!),
    withStyledScroll({height: 'calc(100% - 85px)'})
  )(OrderList)
);

export {ConnectedOrders as Orders};
export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
