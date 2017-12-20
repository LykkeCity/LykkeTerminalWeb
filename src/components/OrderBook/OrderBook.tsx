import * as React from 'react';
import {Table} from '../Table/index';
import {OrderBookItem} from './';
import {OrderBookInterface} from './';

const OrderBook: React.SFC<OrderBookInterface> = ({orders = []}) => (
  <Table>
    <thead>
      <tr>
        <th style={{textAlign: 'right'}}>Sell</th>
        <th>Price</th>
        <th style={{textAlign: 'left'}}>Buy</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order: any) => (
        <OrderBookItem key={`orderitem_${order.id}`} {...order} />
      ))}
    </tbody>
  </Table>
);

export default OrderBook;
