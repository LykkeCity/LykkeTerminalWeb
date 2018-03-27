import {observer} from 'mobx-react';
import {compose} from 'rambda';
import * as TradeFilterModelFns from '../../models/tradeFilter';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar/withScroll';
import withLoader from '../Loader/withLoader';
import PublicTradeList from './PublicTradeList';
import PublicTradeListItem from './PublicTradeListItem';
import TradeFilter, {TradeFilterProps} from './TradeFilter';
import TradeList, {TradeListProps} from './TradeList';
import TradeListItem from './TradeListItem';
import Trades from './Trades';

const ConnectedTrades = connect(
  ({tradeStore: {fetchNextTrades, shouldFetchMore}, authStore: {isAuth}}) => ({
    fetchNextTrades,
    shouldFetchMore,
    isAuth
  }),
  withAuth(Trades)
);

const ConnectedTradeList = connect<TradeListProps>(
  ({tradeStore: {getAllTrades}}) => ({
    trades: getAllTrades,
    loading: getAllTrades.length === 0
  }),
  compose(
    withStyledScroll({height: 'calc(100% - 85px)'}),
    withLoader<TradeListProps>(p => p.trades.length === 0)
  )(TradeList)
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
  withStyledScroll({height: '100%'})(PublicTradeList)
);

const ObservedPublicTradeListItem = observer(PublicTradeListItem);

export {ConnectedTrades as Trades};
export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {ConnectedTradeFilter as TradeFilter};
export {ObservedTradeListItem as TradeListItem};
export {ObservedPublicTradeListItem as PublicTradeListItem};
export {default as TradeListCell} from './TradeListCell';
