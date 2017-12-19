import * as React from 'react';
import {Table} from '../Table/index';
import {TradeListItem} from './index';

interface TradeListProps {
  trades?: any[];
}

const TradeList: React.SFC<TradeListProps> = ({trades = []}) => (
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
