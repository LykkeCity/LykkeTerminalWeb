import * as React from 'react';
import {Table} from '../Table/index';
import {TradeListItem} from './index';
import TradeListInterface from './TradeListInterface';

const TradeList: React.SFC<TradeListInterface> = ({trades = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Side</th>
        <th>Qnt</th>
        <th>Price</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {trades.map((trade: any) => (
        <TradeListItem
          key={`tradeitem_${trade.id}`}
          id={trade.id}
          side={trade.side}
          symbol={trade.symbol}
          quantity={trade.quantity}
          timestamp={trade.timestamp}
          price={trade.price}
        />
      ))}
    </tbody>
  </Table>
);

export default TradeList;
