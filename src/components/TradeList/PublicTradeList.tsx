import * as React from 'react';
import {TradeModel} from '../../models/index';
import {Table} from '../Table/index';
import {PublicTradeListItem} from './index';

interface PublicTradeListProps {
  trades: TradeModel[];
}

export const PublicTradeList: React.SFC<PublicTradeListProps> = ({
  trades = []
}) => (
  <Table>
    <tbody>
      {trades.map(trade => <PublicTradeListItem key={trade.id} {...trade} />)}
    </tbody>
  </Table>
);

export default PublicTradeList;
