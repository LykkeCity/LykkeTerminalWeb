import {extendObservable} from 'mobx';

class OrderBookModel {
  ask: number | string;
  bestBid: boolean;
  bid: number | string;
  id: number;
  price: number;
  timestamp: any;

  constructor(order: Partial<OrderBookModel>) {
    extendObservable(this, order);
  }
}

export default OrderBookModel;
