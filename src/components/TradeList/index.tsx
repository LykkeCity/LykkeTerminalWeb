import {observer} from 'mobx-react';
import {TradeModel} from '../../models/index';
import {connect} from '../connect';
import PublicTradeList from './PublicTradeList';
import TradeList from './TradeList';
import TradeListItem from './TradeListItem';

export interface TradesProps {
  trades?: TradeModel[];
  needToLoadMore?: boolean;
  fetchPart: any;
  stringId?: string;
  authorized?: true;
}

const ConnectedTradeList = connect(
  ({
    tradeStore: {getAllTrades, fetchPartTrade, needToLoadMore},
    authStore
  }) => ({
    authorized: authStore.isAuth,
    fetchPart: fetchPartTrade,
    needToLoadMore,
    trades: getAllTrades
  }),
  TradeList
);

const ConnectedPublicTradeList = connect(
  ({tradeStore: {getPublicTrades, fetchPartPublicTrade}, authStore}) => ({
    fetchPart: fetchPartPublicTrade,
    trades: getPublicTrades
  }),
  PublicTradeList
);

const ObservedTradeListItem = observer(TradeListItem);

export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {ObservedTradeListItem as TradeListItem};
