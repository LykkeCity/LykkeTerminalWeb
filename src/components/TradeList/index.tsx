import TradeListModel from '../../models/tradeListModel';
import {connect} from '../connect';
import TradeList from './TradeList';

export interface TradeListProps {
  trades?: TradeListModel[];
}

export interface TradeListItemProps {
  index: number;
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
