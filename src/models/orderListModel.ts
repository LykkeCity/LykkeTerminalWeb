import {extendObservable} from 'mobx';

class OrderListModel {
  symbol: string;
  side: string;
  volume: number;
  currentPrice: number;
  createdDate: string;
  orderId: string;
  expiryDate: string;

  constructor(order: Partial<OrderListModel>) {
    extendObservable(this, order);
  }
}

export default OrderListModel;
