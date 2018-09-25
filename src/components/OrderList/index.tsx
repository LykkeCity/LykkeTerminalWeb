import {observer} from 'mobx-react';
import {compose, pathOr} from 'rambda';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import {withKyc} from '../Kyc';
import withLoader from '../Loader/withLoader';
import {tableScrollMargin} from '../styled';
import OrderList from './OrderList';
import {OrderListProps} from './OrderList';
import OrderListItem from './OrderListItem';
import Orders from './Orders';

export const OrderCellWidth = {
  Symbol: 100,
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
    authStore: {isAuth, isKycPassed},
    uiStore: {readOnlyMode}
  }) => ({
    addModal,
    cancelOrder,
    isAuth,
    isKycPassed,
    readOnlyMode,
    orders
  }),
  withAuth(withKyc(Orders, false))
);

const ConnectedOrderList = connect<OrderListProps>(
  ({
    orderListStore: {hasPendingOrders},
    referenceStore: {getInstrumentById},
    uiStore: {selectInstrument, selectedInstrument}
  }) => ({
    loading: hasPendingOrders,
    getInstrumentById,
    onChangeInstrumentById: selectInstrument,
    selectedInstrumentId: pathOr('', ['id'], selectedInstrument)
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
