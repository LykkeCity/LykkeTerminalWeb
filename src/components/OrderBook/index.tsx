import {pathOr} from 'rambda';
import {connect} from '../connect';
import OrderBook from './OrderBook';

// prettier-ignore
// tslint:disable:object-literal-sort-keys
const ConnectedOrderBook = connect(
  ({
    modalStore: {addModal},
    orderBookStore: {asks, bids, mid},
    uiStore: {selectedInstrument, stateFns},
    orderStore: {cancelOrder, updatePrice, updatePriceAndDepth}
  }) => {
    const volumeAccuracy = pathOr(0, ['baseAsset', 'accuracy'], selectedInstrument);
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(priceAccuracy);
    return {
      addModal,
      asks,
      bids,
      cancelOrder,
      mid: midPrice,
      volumeAccuracy,
      priceAccuracy,
      updatePrice,
      updatePriceAndDepth,
      stateFns
    };
  },
  OrderBook
);

export default ConnectedOrderBook;
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
