import {connect} from '../connect';
import TradeList from './TradeList';

const ConnectedTradeList = connect(
  ({tradeStore: {allTrades}}) => ({
    trades: allTrades
  }),
  TradeList
);

export {ConnectedTradeList as TradeList};
export {default as TradeListItem} from './TradeListItem';
