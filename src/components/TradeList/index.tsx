import {compose, pathOr} from 'rambda';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {withContentRect} from 'react-measure';
import * as TradeFilterModelFns from '../../models/tradeFilter';
import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar/withScroll';
import {withKyc} from '../Kyc';
import withLoader from '../Loader/withLoader';
import {tableScrollMargin} from '../styled';
import {Export} from './Export';
import TradeFilter, {TradeFilterProps} from './TradeFilter';
import TradeList, {TradeListProps} from './TradeList';
import TradeListItem from './TradeListItem';
import TradeLog, {LEFT_PADDING, TRADE_HEIGHT} from './TradeLog';
import TradeLogHeader from './TradeLogHeader';
import Trades from './Trades';

export const TradesCellWidth = {
  Symbol: 100,
  OrderType: 110
};

const ConnectedTrades = connect(
  ({
    authStore: {isAuth, isKycPassed},
    uiStore: {readOnlyMode},
    tradeStore: {getAllTrades}
  }) => ({
    isAuth,
    isKycPassed,
    readOnlyMode,
    trades: getAllTrades
  }),
  withAuth(withKyc(Trades, false))
);

const ConnectedTradeList = connect<TradeListProps>(
  ({
    tradeStore: {
      hasPendingItems,
      hasPendingCsv,
      shouldFetchMore,
      fetchNextTrades
    },
    uiStore: {selectInstrument, selectedInstrument}
  }) => ({
    loading: hasPendingItems || hasPendingCsv,
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

const ConnectedTradeLogHeader = connect(
  ({uiStore: {selectedInstrument}}) => ({
    selectedInstrument
  }),
  TradeLogHeader
);

const withMeasureAnLoader = compose(
  withLoader(),
  withContentRect('client')
);

const ConnectedTradeLog = connect(
  ({orderBookStore: {hasPendingItems}, uiStore: {selectedInstrument}}) => ({
    loading: hasPendingItems || selectedInstrument === undefined
  }),
  withMeasureAnLoader(({measureRef, contentRect}: any) => (
    <React.Fragment>
      <ConnectedTradeLogHeader />
      <div style={{height: '100%'}} ref={measureRef}>
        <Scrollbars
          style={{
            height: `calc(100% - 1.5rem)`,
            width: 'calc(100% + 1rem)',
            marginLeft: '-0.5rem'
          }}
        >
          <ConnectedTradeLogCanvas
            itemHeight={TRADE_HEIGHT}
            width={contentRect.client.width + LEFT_PADDING || 300}
          />
        </Scrollbars>
      </div>
    </React.Fragment>
  ))
);

const ConnectedTradeLogCanvas = connect(
  ({tradeStore: {getPublicTrades}, uiStore: {selectedInstrument}}) => ({
    trades: getPublicTrades,
    selectedInstrument
  }),
  TradeLog
);

const ConnectedExport = connect(
  ({tradeStore: {fetchCsvUrl, canExport}, authStore: {userInfo}}) => ({
    fetchCsvUrl,
    canExport,
    userInfo
  }),
  Export
);

export {ConnectedTrades as Trades};
export {ConnectedTradeList as TradeList};
export {TradeListItem};
export {ConnectedTradeFilter as TradeFilter};
export {ConnectedTradeLog as TradeLog};
export {ConnectedExport as Export};
