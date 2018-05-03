import {compose} from 'rambda';
import * as TradeFilterModelFns from '../../models/tradeFilter';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar/withScroll';
import withLoader from '../Loader/withLoader';
import {tableScrollMargin} from '../styled';
import PublicTradeList from './PublicTradeList';
import PublicTradeListItem from './PublicTradeListItem';
import TradeFilter, {TradeFilterProps} from './TradeFilter';
import TradeList, {TradeListProps} from './TradeList';
import TradeListItem from './TradeListItem';
import TradeLog from './TradeLog';
import Trades from './Trades';

export const TradesCellWidth = {
  Symbol: 100,
  Side: 70,
  OrderType: 110
};

export const PublicTradesCellWidth = {
  Side: 60
};

const ConnectedTrades = connect(
  ({
    authStore: {isAuth},
    uiStore: {readOnlyMode},
    tradeStore: {getAllTrades}
  }) => ({
    isAuth,
    readOnlyMode,
    trades: getAllTrades
  }),
  withAuth(Trades)
);

const ConnectedTradeList = connect<TradeListProps>(
  ({
    tradeStore: {
      hasPendingItems,
      shouldFetchMore,
      fetchNextTrades,
      isAllTrades
    },
    uiStore: {selectInstrumentById}
  }) => ({
    loading: hasPendingItems,
    fetchNextTrades,
    shouldFetchMore,
    isAllTrades: isAllTrades(),
    onChangeInstrumentById: selectInstrumentById
  }),
  compose(
    withLoader<TradeListProps>(p => p.loading!),
    withStyledScroll({
      width: `calc(100% + ${tableScrollMargin})`,
      height: 'calc(100% - 5rem)'
    })
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
  width: `calc(100% + ${tableScrollMargin})`,
  height: 'calc(100% - 1.75rem)'
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
