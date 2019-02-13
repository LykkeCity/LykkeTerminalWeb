import {HBar} from '@lykkex/react-components';
import {observer} from 'mobx-react';
import {compose, pathOr} from 'rambda';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {withContentRect} from 'react-measure';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {AnalyticsService} from '../../services/analyticsService';
import {connect} from '../connect';
import withLoader from '../Loader/withLoader';
import Bar, {BarProps} from './Bar';
import {FigureListProps, Figures} from './Figures';
import Header from './Header';
import {LevelListProps} from './LevelList';

import MyOrders, {MyOrdersProps} from './MyOrders';

import LevelList from './LevelList';

import LevelType from '../../models/levelType';

export const LEVEL_HEIGHT = 26;
export const LEVELS_COUNT = 50;
export const BAR_WIDTH = 60;
export const TOP_PADDING = 8;
export const LEFT_PADDING = 8;

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
      triggerOrderUpdate,
      spanAccuracy,
      setSpanUpdatingHandler
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
      type: LevelType.Asks,
      spanAccuracy,
      setSpanUpdatingHandler
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
      triggerOrderUpdate,
      spanAccuracy,
      setSpanUpdatingHandler
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
      type: LevelType.Bids,
      spanAccuracy,
      setSpanUpdatingHandler
    };
  },
  observer(LevelList)
);

const ConnectedFigures = connect<FigureListProps>(
  ({
    orderBookStore: {spread, midPrice},
    priceStore: {lastTradePrice},
    authStore: {isAuth},
    uiStore: {selectedInstrument, readOnlyMode},
    uiOrderStore: {handlePriceClickFromOrderBook}
  }) => ({
    lastTradePrice,
    isAuth,
    spreadRelative: spread,
    priceAccuracy: (selectedInstrument && selectedInstrument!.accuracy) || 0,
    format: formatWithAccuracy,
    handlePriceClickFromOrderBook,
    isReadOnly: readOnlyMode,
    mid: midPrice
  }),
  Figures
);

const withMeasureAnLoader = compose(
  withLoader(),
  withContentRect('client')
);

const handleScroll = () => {
  AnalyticsService.track(AnalyticsEvents.ScrollOrderBook);
};

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
      <div style={{height: 'calc(100% - 82px)'}} ref={measureRef}>
        <Scrollbars
          onScrollStop={handleScroll}
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
