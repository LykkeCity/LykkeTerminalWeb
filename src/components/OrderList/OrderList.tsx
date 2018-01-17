import * as React from 'react';
import {Table} from '../Table/index';
import {OrderListItem} from './';
import {OrderListProps} from './';

const OrderList: React.SFC<OrderListProps> = ({orders = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Close</th>
        <th>OrderID</th>
        <th>Side</th>
        <th>Volume</th>
        <th>Current Price</th>
        <th>Created Date</th>
        <th>Expiry Date</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order: any) => (
        <OrderListItem key={order.orderId} {...order} />
      ))}
    </tbody>
  </Table>
);

export default OrderList;
