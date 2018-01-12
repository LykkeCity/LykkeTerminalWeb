import * as React from 'react';
import {Table} from '../Table/index';
import {TradeListItem} from './';
import {TradeListProps} from './';

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
      {trades.map((trade: any, index: number) => (
        <TradeListItem key={`tradeitem_${index}`} index={index} {...trade} />
      ))}
    </tbody>
  </Table>
);

export default TradeList;
