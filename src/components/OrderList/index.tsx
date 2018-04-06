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
  Symbol: 80,
  CancelOrder: 70,
  Id: 300,
  Side: 60,
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
