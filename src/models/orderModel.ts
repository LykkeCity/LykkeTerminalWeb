import {extendObservable} from 'mobx';
import {Side} from './index';

class OrderModel {
  symbol: string;
  side: Side;
  volume: number;
  price: number;
  createdAt: Date;
  id: string;
  cancelOrder?: (id: string) => void;

  constructor(order: Partial<OrderModel>) {
    extendObservable(this, order);
  }
}

export default OrderModel;
