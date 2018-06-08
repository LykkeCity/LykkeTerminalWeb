import {observer} from 'mobx-react';
import {compose, pathOr} from 'rambda';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {withContentRect} from 'react-measure';
import {HBar} from '../Bar';
import {connect} from '../connect';
import withLoader from '../Loader/withLoader';
import Bar, {BarProps} from './Bar';
import Figures, {FigureListProps} from './Figures';
import Header from './Header';
import {LevelListProps} from './LevelList';

import MyOrders, {MyOrdersProps} from './MyOrders';

import LevelList from './LevelList';

import LevelType from '../../models/levelType';

export const LEVEL_HEIGHT = 30;
export const LEVELS_COUNT = 50;
export const LEFT_PADDING = 8;
export const TOP_PADDING = 10;

const formatWithAccuracy = (
  num: number | string,
  accuracy: number,
  options?: object
) =>
  (isFinite(Number(num)) &&
    Number(num).toLocaleString(undefined, {
      minimumFractionDigits: accuracy,
      maximumFractionDigits: accuracy,
      ...options
    })) ||
  '--';

const ConnectedBar = connect<BarProps>(
  ({
    orderBookStore: {span, nextSpan, prevSpan},
    uiStore: {
      orderbookDisplayType,
      changeOrderbookDisplayType,
      selectedInstrument
    }
  }) => ({
    span,
    onPrevSpan: prevSpan,
    onNextSpan: nextSpan,
    priceAccuracy: (selectedInstrument && selectedInstrument.accuracy) || 0,
    displayType: orderbookDisplayType,
    onChangeDisplayType: changeOrderbookDisplayType,
    format: formatWithAccuracy
  }),
  Bar
);

const ConnectedAskLevels = connect<LevelListProps>(
  ({
    orderBookStore: {
      getAsks,
      getBids,
      setAsksUpdatingHandler,
      triggerOrderUpdate
    },
    uiStore: {selectedInstrument, orderbookDisplayType, readOnlyMode}
  }) => {
    return {
      getBids,
      getAsks,
      instrument: selectedInstrument!,
      format: formatWithAccuracy,
      isReadOnly: readOnlyMode,
      displayType: orderbookDisplayType.toLowerCase(),
      setLevelsUpdatingHandler: setAsksUpdatingHandler,
      triggerOrderUpdate,
      type: LevelType.Asks
    };
  },
  observer(LevelList)
);

const ConnectedBidLevels = connect<LevelListProps>(
  ({
    orderBookStore: {
      getBids,
      getAsks,
      setBidsUpdatingHandler,
      triggerOrderUpdate
    },
    uiStore: {selectedInstrument, orderbookDisplayType, readOnlyMode}
  }) => {
    return {
      getBids,
      getAsks,
      instrument: selectedInstrument!,
      format: formatWithAccuracy,
      isReadOnly: readOnlyMode,
      displayType: orderbookDisplayType.toLowerCase(),
      setLevelsUpdatingHandler: setBidsUpdatingHandler,
      triggerOrderUpdate,
      type: LevelType.Bids
    };
  },
  observer(LevelList)
);

const ConnectedFigures = connect<FigureListProps>(
  ({
    orderBookStore: {
      setMidPriceUpdateHandler,
      getSpreadRelative,
      setSpreadHandler
    },
    priceStore: {lastTradePrice},
    authStore: {isAuth},
    uiStore: {selectedInstrument, readOnlyMode},
    uiOrderStore: {handlePriceClickFromOrderBook}
  }) => ({
    lastTradePrice,
    setMidPriceUpdateHandler,
    isAuth,
    getSpreadRelative,
    priceAccuracy: (selectedInstrument && selectedInstrument!.accuracy) || 0,
    format: formatWithAccuracy,
    handlePriceClickFromOrderBook,
    isReadOnly: readOnlyMode,
    setSpreadHandler
  }),
  Figures
);

const withMeasureAnLoader = compose(withLoader(), withContentRect('client'));

const ConnectedOrderbook = connect(
  ({orderBookStore: {hasPendingItems}, uiStore: {selectedInstrument}}) => ({
    loading: hasPendingItems || selectedInstrument === undefined
  }),
  withMeasureAnLoader(({measureRef, contentRect, loading}: any) => (
    <React.Fragment>
      <ConnectedBar />
      <HBar />
      <Header />
      <HBar />
      <div style={{height: 'calc(100% - 75px)'}} ref={measureRef}>
        <Scrollbars
          style={{
            height: `100%`,
            width: 'calc(100% + 1rem)',
            marginLeft: '-0.5rem'
          }}
          ref={(node: any) => {
            // tslint:disable-next-line:no-unused-expression
            node &&
              node.scrollTop(
                LEVELS_COUNT * LEVEL_HEIGHT -
                  (contentRect.client.height - 52) / 2
              );
          }}
        >
          <ConnectedAskLevels
            height={LEVELS_COUNT * LEVEL_HEIGHT}
            width={contentRect.client.width + LEFT_PADDING || 300}
          />
          {loading ? null : <ConnectedFigures />}
          <ConnectedBidLevels
            height={LEVELS_COUNT * LEVEL_HEIGHT}
            width={contentRect.client.width + LEFT_PADDING || 300}
          />
        </Scrollbars>
      </div>
      <ConnectedMyOrders />
    </React.Fragment>
  ))
);

const ConnectedMyOrders = connect<MyOrdersProps>(
  ({orderBookStore: {myOrders}, uiStore: {selectedInstrument}}) => ({
    ...myOrders,
    accuracy: pathOr(0, ['baseAsset', 'accuracy'], selectedInstrument)
  }),
  MyOrders
);

export default ConnectedOrderbook;
