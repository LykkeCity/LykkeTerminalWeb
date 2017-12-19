import * as React from 'react';
import {Table} from '../Table/index';
import {OrderListItem} from './';
import OrderListInterface from './OrderListInterface';

const OrderList: React.SFC<OrderListInterface> = ({orders = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Close</th>
        <th>OrderID</th>
        <th>Side</th>
        <th>Volume</th>
        <th>Open Price</th>
        <th>Current Price</th>
        <th>Created Date</th>
        <th>Expiry Date</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order: any) => (
        <OrderListItem
          createdDate={order.createdDate}
          currentPrice={order.currentPrice}
          currentPriceSide={order.currentPriceSide}
          expiryDate={order.expiryDate}
          id={order.id}
          key={`orderitem_${order.id}`}
          orderID={order.orderID}
          openPrice={order.openPrice}
          side={order.side}
          symbol={order.symbol}
          volume={order.volume}
        />
      ))}
    </tbody>
  </Table>
);

export default OrderList;
