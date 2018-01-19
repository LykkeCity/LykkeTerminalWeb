import * as React from 'react';
import {OrderModel} from '../../models/index';
import {Table} from '../Table/index';
import {OrderListItem} from './';

interface OrderListProps {
  onCancel: (id: string) => void;
  orders?: OrderModel[];
}

const OrderList: React.SFC<OrderListProps> = ({orders = [], onCancel}) => (
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
      {orders.map(order => {
        // order.onCancel = onCancel;
        return <OrderListItem key={order.id} {...order} />;
      })}
    </tbody>
  </Table>
);

export default OrderList;
