import {observer} from 'mobx-react';
import * as TradeFilterModelFns from '../../models/tradeFilter';
import {connect} from '../connect';
import PublicTradeList from './PublicTradeList';
import PublicTradeListItem from './PublicTradeListItem';
import TradeFilter, {TradeFilterProps} from './TradeFilter';
import TradeList, {TradeListProps} from './TradeList';
import TradeListItem from './TradeListItem';
import Trades from './Trades';

const ConnectedTrades = connect(
  ({tradeStore: {fetchPartTrade, needToLoadMore}, authStore}) => ({
    authorized: authStore.isAuth,
    fetchPart: fetchPartTrade,
    needToLoadMore
  }),
  Trades
);

const ConnectedTradeList = connect<TradeListProps>(
  ({tradeStore: {filteredTrades}, uiStore: {selectedInstrument}}) => ({
    trades: filteredTrades,
    selectedInstrument
  }),
  TradeList
);

const ObservedTradeListItem = observer(TradeListItem);

const ConnectedTradeFilter = connect<TradeFilterProps>(
  ({tradeStore: {filter, setFilter}}) => ({
    value: filter,
    options: TradeFilterModelFns.toOptions(),
    onFilter: setFilter
  }),
  TradeFilter
);

const ConnectedPublicTradeList = connect(
  ({tradeStore: {getPublicTrades}, uiStore: {selectedInstrument}}) => ({
    trades: getPublicTrades,
    selectedInstrument
  }),
  PublicTradeList
);

const ObservedPublicTradeListItem = observer(PublicTradeListItem);

export {ConnectedTrades as Trades};
export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {ObservedTradeListItem as TradeListItem};
export {ObservedPublicTradeListItem as PublicTradeListItem};
export {ConnectedTradeFilter as TradeFilter};
