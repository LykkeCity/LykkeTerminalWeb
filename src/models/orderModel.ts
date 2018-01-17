import {extendObservable} from 'mobx';

class OrderModel {
  symbol: string;
  side: string;
  volume: number;
  currentPrice: number;
  createdDate: string;
  orderId: string;
  expiryDate: string;

  constructor(orderList: Partial<OrderModel>) {
    extendObservable(this, orderList);
  }
}

export default OrderModel;
