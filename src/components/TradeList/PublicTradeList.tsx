import * as React from 'react';
import {TradeModel} from '../../models/index';
import {TradeListItem} from './index';

interface PublicTradeListProps {
  trades: TradeModel[];
}

export const PublicTradeList: React.SFC<PublicTradeListProps> = ({
  trades = []
}) => (
  <div>{trades.map(trade => <TradeListItem key={trade.id} {...trade} />)}</div>
);

export default PublicTradeList;
