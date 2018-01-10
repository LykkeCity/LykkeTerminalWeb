import {connect} from '../connect';
import OrderBook from './OrderBook';

export interface OrderBookProps {
  orders?: any[];
  buyOrders?: any[];
  sellOrders?: any[];
  midPrice?: number;
}

export interface OrderBookItemProps {
  ask: number;
  bestBid: boolean;
  bid: number;
  id: number;
  price: number;
  maxVolume: number;
}

const ConnectedOrderBook = connect(
  ({
    orderBookStore: {
      allBuyOrders: buyOrders,
      allSellOrders: sellOrders,
      midPriceValue: midPrice
    }
  }) => ({
    buyOrders,
    midPrice,
    sellOrders
  }),
  OrderBook
);

export {ConnectedOrderBook as OrderBook};
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
