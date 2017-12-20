import {connect} from '../connect';
import TradeList from './TradeList';

const ConnectedTradeList = connect(
  ({tradeListStore: {allTradeLists: trades}}) => ({
    trades
  }),
  TradeList
);

export {ConnectedTradeList as TradeList};
export {default as TradeListItem} from './TradeListItem/TradeListItem';
