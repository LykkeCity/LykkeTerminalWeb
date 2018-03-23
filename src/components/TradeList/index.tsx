import * as TradeFilterModelFns from '../../models/tradeFilter';
import {withAuth} from '../Auth';
import {connect} from '../connect';
// import {withScroll} from '../CustomScrollbar';
import {withStyledScroll} from '../CustomScrollbar/withScroll';
import PublicTradeList from './PublicTradeList';
import TradeFilter, {TradeFilterProps} from './TradeFilter';
import TradeList, {TradeListProps} from './TradeList';
import Trades from './Trades';

const ConnectedTrades = connect(
  ({tradeStore: {fetchPartTrade, needToLoadMore}, authStore: {isAuth}}) => ({
    fetchPart: fetchPartTrade,
    needToLoadMore,
    isAuth
  }),
  withAuth(Trades)
);

const ConnectedTradeList = connect<TradeListProps>(
  ({tradeStore: {filteredTrades}, uiStore: {selectedInstrument}}) => ({
    trades: filteredTrades,
    selectedInstrument
  }),
  withStyledScroll({height: 'calc(100% - 85px)'})(TradeList)
);

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

export {ConnectedTrades as Trades};
export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {ConnectedTradeFilter as TradeFilter};
export {default as TradeListCell} from './TradeListCell';
