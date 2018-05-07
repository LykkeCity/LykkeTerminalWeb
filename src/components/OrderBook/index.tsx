import {observer} from 'mobx-react';
import {compose, concat, curry, map, pathOr, prop, toLower} from 'rambda';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {withContentRect} from 'react-measure';
import {normalizeVolume} from '../../utils';
import {HBar} from '../Bar';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar';
import withLoader from '../Loader/withLoader';
import Bar, {BarProps} from './Bar';
import Figures, {FigureListProps} from './Figures';
import Header from './Header';
import {LevelList, LevelListProps} from './LevelList';
import LevelListItemClickable from './LevelListClickable';
import LevelListItem from './LevelListItem';
import MyOrders, {MyOrdersProps} from './MyOrders';
import OrderBookItem from './OrderBookItem';

const LEVEL_HEIGHT = 30;
export const LEVELS_COUNT = 50;

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

export const ConnectedOrderBook2 = connect(
  ({
    modalStore: {addModal},
    orderBookStore: {
      asks,
      bids,
      mid,
      spreadRelative,
      seedSpan,
      span,
      nextSpan,
      prevSpan,
      showMyOrders,
      hasPendingItems
    },
    uiStore: {selectedInstrument},
    orderStore: {cancelOrder, updatePrice, updatePriceAndDepth},
    priceStore: {lastTradePrice},
    authStore: {isAuth}
  }) => {
    const volumeAccuracy = pathOr(
      0,
      ['baseAsset', 'accuracy'],
      selectedInstrument
    );
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(priceAccuracy);
    return {
      addModal,
      asks,
      bids,
      cancelOrder,
      mid: midPrice,
      spreadRelative,
      volumeAccuracy,
      priceAccuracy,
      updatePrice,
      updatePriceAndDepth,
      span,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan,
      showMyOrders,
      lastTradePrice,
      loading: hasPendingItems,
      isAuth,
      selectedInstrument
    };
  },
  compose(withScroll, withLoader())(LevelList)
);

const ConnectedOrderBookItem = observer(OrderBookItem);

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
    uiStore: {selectedInstrument, orderbookDisplayType}
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
      normalize
    };
  },
  observer(LevelList)
);

const ConnectedBids = connect<LevelListProps>(
  ({
    orderBookStore: {asks, bids},
    uiStore: {selectedInstrument, orderbookDisplayType}
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
      normalize
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

const ConnectedLevelListItemClickable = connect(
  ({orderStore: {updatePrice, updateDepth, updateOrderState}}) => ({
    updatePrice,
    updateDepth,
    updateOrderState
  }),
  observer(LevelListItemClickable)
);

const ConnectedFigures = connect<FigureListProps>(
  ({
    orderBookStore: {mid, spreadRelative},
    priceStore: {lastTradePrice},
    authStore: {isAuth},
    uiStore: {selectedInstrument}
  }) => ({
    lastTradePrice,
    mid: mid(),
    isAuth,
    spreadRelative,
    priceAccuracy: (selectedInstrument && selectedInstrument!.accuracy) || 0,
    format: formatWithAccuracy
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
            width={contentRect.client.width || 300}
          />
          {loading ? null : <ConnectedFigures />}
          <ConnectedBids
            height={LEVELS_COUNT * LEVEL_HEIGHT}
            width={contentRect.client.width || 300}
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
export {ConnectedOrderBookItem as OrderBookItem};
export {ConnectedFigures as Figures};
export {ConnectedMyOrders as MyOrders};
export {ConnectedLevelListItem as LevelListItem};
export {ConnectedLevelListItemClickable as LevelListItemClickable};
