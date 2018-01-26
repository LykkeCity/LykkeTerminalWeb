import * as React from 'react';
import {OrderModel} from '../../models/index';
import {Table} from '../Table/index';
import {OrderActions, OrderListItem} from './';

interface OrderListProps extends OrderActions {
  orders?: OrderModel[];
}

const OrderList: React.SFC<OrderListProps> = ({orders = [], cancelOrder}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Close</th>
        <th>OrderID</th>
        <th>Side</th>
        <th>Volume</th>
        <th>Price</th>
        <th>Created Date</th>
      </tr>
    </thead>
    <tbody>
      {orders.map(order => (
        <OrderListItem key={order.id} cancelOrder={cancelOrder} {...order} />
      ))}
    </tbody>
  </Table>
);

export default OrderList;
