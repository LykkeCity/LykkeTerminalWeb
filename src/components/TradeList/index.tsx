import TradeModel from '../../models/tradeModel';
import {connect} from '../connect';
import TradeList from './TradeList';

export interface TradeListProps {
  trades?: TradeModel[];
}

export interface TradeListItemProps {
  index: number;
  side: string;
  symbol: string;
  quantity: number;
  timestamp: Date;
  tradeId: number;
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
