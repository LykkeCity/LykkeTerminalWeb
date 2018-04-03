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
import TradeLog from './TradeLog';
import Trades from './Trades';

const ConnectedTrades = connect(
  ({authStore: {isAuth}}) => ({
    isAuth
  }),
  withAuth(Trades)
);

const ConnectedTradeList = connect<TradeListProps>(
  ({
    tradeStore: {
      getAllTrades,
      hasPendingItems,
      shouldFetchMore,
      fetchNextTrades
    }
  }) => ({
    trades: getAllTrades,
    loading: hasPendingItems,
    fetchNextTrades,
    shouldFetchMore
  }),
  compose(
    withLoader<TradeListProps>(p => p.loading!),
    withStyledScroll({height: 'calc(100% - 85px)'})
  )(TradeList)
);

const ConnectedTradeFilter = connect<TradeFilterProps>(
  ({tradeStore: {filter, setFilter}}) => ({
    value: filter,
    options: TradeFilterModelFns.toOptions(),
    onFilter: setFilter
  }),
  TradeFilter
);

const ConnectedPublicTradeList = withStyledScroll({
  height: 'calc(100% - 40px)'
})(PublicTradeList);

const ConnectedTradeLog = connect(
  ({tradeStore: {getPublicTrades}, uiStore: {selectedInstrument}}) => ({
    trades: getPublicTrades,
    selectedInstrument
  }),
  TradeLog
);

export {ConnectedTrades as Trades};
export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {TradeListItem};
export {PublicTradeListItem};
export {ConnectedTradeFilter as TradeFilter};
export {ConnectedTradeLog as TradeLog};
