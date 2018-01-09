import * as React from 'react';
import {Table} from '../Table/index';
import {OrderBookItem} from './';
import {OrderBookProps} from './';

const OrderBook: React.SFC<OrderBookProps> = ({orders = []}) => (
  <Table>
    <thead>
      <tr>
        <th style={{textAlign: 'right'}}>Sell</th>
        <th>Price</th>
        <th style={{textAlign: 'left'}}>Buy</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order: any, index: number) => (
        <OrderBookItem
          key={`orderitem_${index}`}
          maxVolume={Math.max(
            ...orders.map(x => x.ask).concat(orders.map(x => x.ask))
          )}
          {...order}
        />
      ))}
    </tbody>
  </Table>
);

export default OrderBook;
