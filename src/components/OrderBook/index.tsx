import {observer} from 'mobx-react';
import {pathOr} from 'rambda';
import {connect} from '../connect';
import MyOrders, {MyOrdersProps} from './MyOrders';
import OrderBook from './OrderBook';
import OrderBookItem from './OrderBookItem';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBook = connect(
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
      showMyOrders
    },
    uiStore: {selectedInstrument, stateFns},
    orderStore: {cancelOrder, updatePrice, updatePriceAndDepth},
    priceStore: {lastTradePrice}
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
      stateFns,
      span,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan,
      showMyOrders,
      lastTradePrice
    };
  },
  OrderBook
);

const ConnectedOrderBookItem = observer(OrderBookItem);

const ConnectedMyOrders = connect<MyOrdersProps>(
  ({orderBookStore: {myOrders}}) => ({
    ...myOrders
  }),
  MyOrders
);

export default ConnectedOrderBook;
export {ConnectedOrderBookItem as OrderBookItem};
export {ConnectedMyOrders as MyOrders};
