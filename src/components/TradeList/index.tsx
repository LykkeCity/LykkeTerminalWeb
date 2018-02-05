import {connect} from '../connect';
import PublicTradeList from './PublicTradeList';
import TradeList from './TradeList';

const ConnectedTradeList = connect(
  ({tradeStore: {getAllTrades, fetchPart}}) => ({
    fetchPart,
    trades: getAllTrades
  }),
  TradeList
);

const ConnectedPublicTradeList = connect(
  ({tradeStore: {getPublicTrades}}) => ({
    trades: getPublicTrades
  }),
  PublicTradeList
);

export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {default as TradeListItem} from './TradeListItem';
