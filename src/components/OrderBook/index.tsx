import {observer} from 'mobx-react';
import {compose, pathOr, toLower} from 'rambda';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {withContentRect} from 'react-measure';
import {HBar} from '../Bar';
import {connect} from '../connect';
import withLoader from '../Loader/withLoader';
import Bar, {BarProps} from './Bar';
import Figures, {FigureListProps} from './Figures';
import Header from './Header';
import {LevelListProps} from './OrderbookCanvas';

import LevelListItem from './LevelListItem';
import MyOrders, {MyOrdersProps} from './MyOrders';
import OrderBookCanvas from './OrderbookCanvas';

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
    orderBookStore: {spreadRelative, span, nextSpan, prevSpan},
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

const ConnectedOrderBookCanvasAsk = connect<LevelListProps>(
  ({
    orderBookStore: {getAsks, getBids, setCbForDrawAsks},
    uiStore: {selectedInstrument, orderbookDisplayType, readOnlyMode},
    uiOrderBookStore: {handleAskLevelCellsClick, storeAskLevelCellInfo}
  }) => {
    return {
      getLevels: getAsks,
      getBids,
      getAsks,
      instrument: selectedInstrument!,
      format: formatWithAccuracy,
      handleOrderBookClick: handleAskLevelCellsClick,
      storeLevelCellInfo: storeAskLevelCellInfo,
      isReadOnly: readOnlyMode,
      displayType: orderbookDisplayType.toLowerCase(),
      handleDrawLevels: setCbForDrawAsks,
      levelsType: 'ask'
    };
  },
  observer(OrderBookCanvas)
);

const ConnectedOrderBookCanvasBid = connect<LevelListProps>(
  ({
    orderBookStore: {getBids, getAsks, setCbForDrawBids},
    uiStore: {selectedInstrument, orderbookDisplayType, readOnlyMode},
    uiOrderBookStore: {handleBidLevelCellsClick, storeBidLevelCellInfo}
  }) => {
    return {
      getLevels: getBids,
      getBids,
      getAsks,
      instrument: selectedInstrument!,
      format: formatWithAccuracy,
      handleOrderBookClick: handleBidLevelCellsClick,
      storeLevelCellInfo: storeBidLevelCellInfo,
      isReadOnly: readOnlyMode,
      displayType: orderbookDisplayType.toLowerCase(),
      handleDrawLevels: setCbForDrawBids,
      levelsType: 'bid'
    };
  },
  observer(OrderBookCanvas)
);

const ConnectedLevelListItem = connect(
  ({uiStore: {orderbookDisplayType}}) => ({
    displayType: toLower(orderbookDisplayType)
  }),
  observer(LevelListItem)
);

const ConnectedFigures = connect<FigureListProps>(
  ({
    orderBookStore: {mid, spreadRelative},
    priceStore: {lastTradePrice},
    authStore: {isAuth},
    uiStore: {selectedInstrument, readOnlyMode},
    uiOrderStore: {handlePriceClickFromOrderBook}
  }) => ({
    lastTradePrice,
    mid: mid(),
    isAuth,
    spreadRelative,
    priceAccuracy: (selectedInstrument && selectedInstrument!.accuracy) || 0,
    format: formatWithAccuracy,
    handlePriceClickFromOrderBook,
    isReadOnly: readOnlyMode
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
          <ConnectedOrderBookCanvasAsk
            height={LEVELS_COUNT * LEVEL_HEIGHT}
            width={contentRect.client.width + LEFT_PADDING || 300}
          />
          {loading ? null : <ConnectedFigures />}
          <ConnectedOrderBookCanvasBid
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
export {ConnectedLevelListItem as LevelListItem};
