import * as React from 'react';
import {OrderModel} from '../../models/index';
import Types from '../../models/modals';
import {HBar} from '../Bar';
import {OrderActions, OrderList} from './';
import {CancelAllOrders, ToggleOrders} from './OrderListAdditional';
import OrderListToolbar from './OrderListToolbar';

interface OrdersProps extends OrderActions {
  orders: OrderModel[];
  addModal: any;
}

const Blotter: React.SFC<OrdersProps> = ({
  orders = [],
  cancelOrder,
  addModal
}) => {
  const handleEditOrder = (order: any) => (id: string) => {
    addModal(
      id,
      // tslint:disable-next-line:no-empty
      () => {},
      // tslint:disable-next-line:no-empty
      () => {},
      Types.EditOrder,
      order
    );
  };

  return (
    <React.Fragment>
      <OrderListToolbar>
        <ToggleOrders />
        <CancelAllOrders />
      </OrderListToolbar>
      <HBar />
      <OrderList
        orders={orders}
        onEditOrder={handleEditOrder}
        onCancelOrder={cancelOrder}
      />
    </React.Fragment>
  );
};

export default Blotter;
