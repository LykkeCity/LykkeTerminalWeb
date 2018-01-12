import {extendObservable} from 'mobx';

class OrderListModel {
  symbol: string;
  side: string;
  volume: number;
  currentPrice: number;
  createdDate: string;
  orderId: string;
  expiryDate: string;

  constructor(orderList: Partial<OrderListModel>) {
    extendObservable(this, orderList);
  }
}

export default OrderListModel;
