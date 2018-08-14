import {compose, pathOr} from 'rambda';
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
  OrderType: 110
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
    tradeStore: {hasPendingItems, shouldFetchMore, fetchNextTrades},
    uiStore: {selectInstrument, selectedInstrument}
  }) => ({
    loading: hasPendingItems,
    fetchNextTrades,
    shouldFetchMore,
    onChangeInstrumentById: selectInstrument,
    selectedInstrumentId: pathOr('', ['id'], selectedInstrument)
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
  ({
    tradeStore: {
      getPublicTrades,
      getIsWampTradesProcessed,
      setIsWampTradesProcessed
    },
    uiStore: {selectedInstrument}
  }) => ({
    trades: getPublicTrades,
    selectedInstrument,
    getIsWampTradesProcessed,
    setIsWampTradesProcessed
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
