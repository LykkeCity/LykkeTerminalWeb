import * as React from 'react';
import {TradeListItem} from '.';
import {TradeModel} from '../../models';
import {Table} from '../Table';

export interface TradeListProps {
  trades: TradeModel[];
}

const TradeList: React.SFC<TradeListProps> = ({trades = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Asset pair</th>
        <th>Side</th>
        <th>Volume</th>
        <th>Price</th>
        <th>Opposite volume</th>
        <th>Order type</th>
        <th>Fee</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      {trades.map(trade => <TradeListItem key={trade.id} {...trade} />)}
    </tbody>
  </Table>
);

export default TradeList;
