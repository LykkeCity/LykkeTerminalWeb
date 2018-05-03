import {observer} from 'mobx-react';
import {compose} from 'rambda';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import withLoader from '../Loader/withLoader';
import {tableScrollMargin} from '../styled';
import OrderList from './OrderList';
import {OrderListProps} from './OrderList';
import OrderListItem from './OrderListItem';
import Orders from './Orders';

export const OrderCellWidth = {
  Symbol: 100,
  Side: 70,
  Actions: 110
};

export interface OrderActions {
  cancelOrder: (id: string) => void;
}

const ConnectedOrders = connect(
  ({
    orderListStore: {limitOrders: orders},
    orderStore: {cancelOrder},
    modalStore: {addModal},
    authStore: {isAuth},
    uiStore: {readOnlyMode}
  }) => ({
    addModal,
    cancelOrder,
    isAuth,
    readOnlyMode,
    orders
  }),
  withAuth(Orders)
);

const ConnectedOrderList = connect<OrderListProps>(
  ({
    orderListStore: {hasPendingOrders, isAllOrders},
    referenceStore: {getInstrumentById},
    uiStore: {selectInstrumentById}
  }) => ({
    loading: hasPendingOrders,
    getInstrumentById,
    isAllOrders: isAllOrders(),
    onChangeInstrumentById: selectInstrumentById
  }),
  compose(
    withLoader<OrderListProps>(p => p.loading!),
    withStyledScroll({
      width: `calc(100% + ${tableScrollMargin})`,
      height: 'calc(100% - 5rem)'
    })
  )(OrderList)
);

const ConnectedOrderListItem = observer(OrderListItem);

export {ConnectedOrders as Orders};
export {ConnectedOrderList as OrderList};
export {ConnectedOrderListItem as OrderListItem};
