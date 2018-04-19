import {observer} from 'mobx-react';
import {compose} from 'rambda';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import withLoader from '../Loader/withLoader';
import OrderList from './OrderList';
import {OrderListProps} from './OrderList';
import OrderListItem from './OrderListItem';
import Orders from './Orders';

export const OrderCellWidth = {
  Symbol: 70,
  Id: 300,
  Side: 50,
  Filled: 100,
  CreatedDate: 150,
  Actions: 60
};

export interface OrderActions {
  cancelOrder: (id: string) => void;
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
  ({
    orderListStore: {limitOrders: orders, hasPendingRequests},
    referenceStore: {getInstrumentById}
  }) => ({
    orders,
    loading: hasPendingRequests,
    getInstrumentById
  }),
  compose(
    withLoader<OrderListProps>(p => p.loading!),
    withStyledScroll({height: 'calc(100% - 85px)'})
  )(OrderList)
);

const ConnectedOrderListItem = observer(OrderListItem);

export {ConnectedOrders as Orders};
export {ConnectedOrderList as OrderList};
export {ConnectedOrderListItem as OrderListItem};
