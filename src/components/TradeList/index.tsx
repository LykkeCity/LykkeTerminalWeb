import {observer} from 'mobx-react';
import {InstrumentModel, TradeModel} from '../../models/index';
import {connect} from '../connect';
import PublicTradeList from './PublicTradeList';
import PublicTradeListItem from './PublicTradeListItem';
import TradeList from './TradeList';
import TradeListItem from './TradeListItem';

export interface TradesProps {
  trades?: TradeModel[];
  needToLoadMore?: boolean;
  fetchPart: any;
  stringId?: string;
  authorized?: true;
  selectedInstrument?: InstrumentModel; // TODO: move it back as mandatory after merge with public trades
}

const ConnectedTradeList = connect(
  ({
    tradeStore: {getAllTrades, fetchPartTrade, needToLoadMore},
    authStore,
    uiStore: {selectedInstrument}
  }) => ({
    authorized: authStore.isAuth,
    fetchPart: fetchPartTrade,
    needToLoadMore,
    trades: getAllTrades,
    // tslint:disable-next-line:object-literal-sort-keys
    selectedInstrument
  }),
  TradeList
);

const ConnectedPublicTradeList = connect(
  ({tradeStore: {getPublicTrades}, uiStore: {selectedInstrument}}) => ({
    trades: getPublicTrades,
    selectedInstrument
  }),
  PublicTradeList
);

const ObservedTradeListItem = observer(TradeListItem);
const ObservedPublicTradeListItem = observer(PublicTradeListItem);

export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {ObservedTradeListItem as TradeListItem};
export {ObservedPublicTradeListItem as PublicTradeListItem};
