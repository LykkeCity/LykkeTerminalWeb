import {observer} from 'mobx-react';
import {compose, concat, curry, map, pathOr, prop, toLower} from 'rambda';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {withContentRect} from 'react-measure';
import {normalizeVolume} from '../../utils';
import {HBar} from '../Bar';
import {connect} from '../connect';
import withLoader from '../Loader/withLoader';
import Bar, {BarProps} from './Bar';
import Figures, {FigureListProps} from './Figures';
import Header from './Header';
import {LevelList, LevelListProps} from './LevelList';
import LevelListItem from './LevelListItem';
import MyOrders, {MyOrdersProps} from './MyOrders';

const LEVEL_HEIGHT = 30;
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

const ConnectedAsks = connect<LevelListProps>(
  ({
    orderBookStore: {asks, bids},
    uiStore: {selectedInstrument, orderbookDisplayType, readOnlyMode},
    uiOrderBookStore: {handleAskLevelCellsClick, storeAskLevelCellInfo}
  }) => {
    const levels = concat(asks, bids);
    const vals = map(prop(toLower(orderbookDisplayType)), levels) as number[];
    const normalize = curry(normalizeVolume)(
      Math.min(...vals),
      Math.max(...vals)
    );
    return {
      levels: asks,
      instrument: selectedInstrument!,
      format: formatWithAccuracy,
      normalize,
      handleOrderBookClick: handleAskLevelCellsClick,
      storeLevelCellInfo: storeAskLevelCellInfo,
      isReadOnly: readOnlyMode
    };
  },
  observer(LevelList)
);

const ConnectedBids = connect<LevelListProps>(
  ({
    orderBookStore: {asks, bids},
    uiStore: {selectedInstrument, orderbookDisplayType, readOnlyMode},
    uiOrderBookStore: {handleBidLevelCellsClick, storeBidLevelCellInfo}
  }) => {
    const vals = map(prop(toLower(orderbookDisplayType)), [
      ...asks,
      ...bids
    ]) as number[];
    const normalize = curry(normalizeVolume)(
      Math.min(...vals),
      Math.max(...vals)
    );
    return {
      levels: bids,
      instrument: selectedInstrument!,
      format: formatWithAccuracy,
      normalize,
      handleOrderBookClick: handleBidLevelCellsClick,
      storeLevelCellInfo: storeBidLevelCellInfo,
      isReadOnly: readOnlyMode
    };
  },
  observer(LevelList)
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
          <ConnectedAsks
            height={LEVELS_COUNT * LEVEL_HEIGHT}
            width={contentRect.client.width + LEFT_PADDING || 300}
          />
          {loading ? null : <ConnectedFigures />}
          <ConnectedBids
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
