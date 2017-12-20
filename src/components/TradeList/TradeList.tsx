import * as React from 'react';
import {Table} from '../Table/index';
import {TradeListItem} from './';
import {TradeListInterface} from './';

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
        <TradeListItem key={`tradeitem_${trade.id}`} {...trade} />
      ))}
    </tbody>
  </Table>
);

export default TradeList;
