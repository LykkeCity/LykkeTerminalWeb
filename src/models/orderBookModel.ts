import {extendObservable} from 'mobx';

class OrderBookModel {
  ask: number;
  bid: number;
  id: number;
  price: number;
  timestamp: any;

  constructor(order: Partial<OrderBookModel>) {
    extendObservable(this, order);
  }
}

export default OrderBookModel;
