import * as React from 'react';
import {OrderListItem} from '.';
import {OrderModel} from '../../models';
import {Table} from '../Table';

interface OrderListProps {
  orders: OrderModel[];
  onEditOrder: (order: OrderModel) => (id: string) => void;
  onCancelOrder?: (id: string) => void;
}

const OrderList: React.SFC<OrderListProps> = ({
  orders,
  onEditOrder,
  onCancelOrder
}) => (
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
          cancelOrder={onCancelOrder}
          onEdit={onEditOrder(order)}
          {...order}
        />
      ))}
    </tbody>
  </Table>
);

export default OrderList;
