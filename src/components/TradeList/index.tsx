import {connect} from '../connect';
import TradeList from './TradeList';

export interface TradeListProps {
  trades?: any[];
}

export interface TradeListItemProps {
  id: number;
  side: string;
  symbol: string;
  quantity: number;
  timestamp: Date;
  price: number;
}

const ConnectedTradeList = connect(
  ({tradeListStore: {allTradeLists: trades}}) => ({
    trades
  }),
  TradeList
);

export {ConnectedTradeList as TradeList};
export {default as TradeListItem} from './TradeListItem/TradeListItem';
