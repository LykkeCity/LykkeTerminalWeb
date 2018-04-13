import {compose} from 'rambda';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import withLoader from '../Loader/withLoader';
import {tableScrollMargin} from '../styled';
import OrderList from './OrderList';
import {OrderListProps} from './OrderList';
import Orders from './Orders';

export const OrderCellWidth = {
  Symbol: 100,
  CancelOrder: 50,
  Id: 320,
  Side: 70,
  Filled: 100,
  CreatedDate: 200,
  Edit: 40
};

export interface OrderActions {
  cancelOrder?: (id: string) => void;
}

const ConnectedOrders = connect(
  ({
    orderListStore: {limitOrders: orders},
    orderStore: {cancelOrder},
    modalStore: {addModal},
    authStore: {isAuth}
  }) => ({
    addModal,
    cancelOrder,
    isAuth,
    orders
  }),
  withAuth(Orders)
);

const ConnectedOrderList = connect<OrderListProps>(
  ({
    orderListStore: {hasPendingOrders},
    referenceStore: {getInstrumentById}
  }) => ({
    loading: hasPendingOrders,
    getInstrumentById
  }),
  compose(
    withLoader<OrderListProps>(p => p.loading!),
    withStyledScroll({
      width: `calc(100% + ${tableScrollMargin})`,
      height: 'calc(100% - 85px)'
    })
  )(OrderList)
);

export {ConnectedOrders as Orders};
export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
