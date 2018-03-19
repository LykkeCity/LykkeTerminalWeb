import {observer} from 'mobx-react';
import {InstrumentModel, TradeModel} from '../../models/index';
import {connect} from '../connect';
import PublicTradeList from './PublicTradeList';
import TradeList from './TradeList';
import TradeListCell from './TradeListCell';

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
  ({tradeStore: {getPublicTrades, fetchPartPublicTrade}, authStore}) => ({
    fetchPart: fetchPartPublicTrade,
    trades: getPublicTrades
  }),
  PublicTradeList
);

const ObservedTradeListCell = observer(TradeListCell);

export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {ObservedTradeListCell as TradeListCell};
