import * as React from 'react';
import {OrderModel} from '../../models/index';
import Types from '../../models/modals';
import {HBar} from '../Bar';
import {Table} from '../Table/index';
import {OrderActions, OrderListItem} from './';
import {CancelAllOrders, ToggleOrders} from './OrderListAdditional';
import OrderListToolbar from './OrderListToolbar';

interface OrderListProps extends OrderActions {
  orders?: OrderModel[];
  addModal: any;
}

const OrderList: React.SFC<OrderListProps> = ({
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
      <Table>
        <thead>
          <tr>
            <th>Asset pair</th>
            <th>Cancel order</th>
            <th>OrderID</th>
            <th>Side</th>
            <th>Volume</th>
            <th>Price</th>
            <th>Created Date</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <OrderListItem
              key={order.id}
              cancelOrder={cancelOrder}
              {...order}
              onEdit={handleEditOrder(order)}
            />
          ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default OrderList;
