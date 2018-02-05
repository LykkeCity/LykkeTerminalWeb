import {TradeModel} from '../../models';
import {connect} from '../connect';
import PublicTradeList from './PublicTradeList';
import TradeList from './TradeList';

export interface TradesProps {
  trades?: TradeModel[];
  fetchPart: any;
  stringId?: string;
}

const ConnectedTradeList = connect(
  ({tradeStore: {getAllTrades, fetchPartTrade}}) => ({
    fetchPart: fetchPartTrade,
    trades: getAllTrades
  }),
  TradeList
);

const ConnectedPublicTradeList = connect(
  ({tradeStore: {getPublicTrades, fetchPartPublicTrade}}) => ({
    fetchPart: fetchPartPublicTrade,
    trades: getPublicTrades
  }),
  PublicTradeList
);

export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {default as TradeListItem} from './TradeListItem';
