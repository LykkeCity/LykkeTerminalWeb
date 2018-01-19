import * as React from 'react';
import {TradeModel} from '../../models/index';
import {Table} from '../Table/index';
import {TradeListItem} from './';

interface TradeListProps {
  trades?: TradeModel[];
}

const TradeList: React.SFC<TradeListProps> = ({trades = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Qnt</th>
        <th>Price</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {trades.map(trade => <TradeListItem key={trade.tradeId} {...trade} />)}
    </tbody>
  </Table>
);

export default TradeList;
