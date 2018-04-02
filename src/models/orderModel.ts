import {extendObservable} from 'mobx';
import {Side} from './index';

class OrderModel {
  symbol: string;
  side: Side;
  volume: number;
  remainingVolume: number;
  price: number;
  createdAt: Date;
  id: string;
  cancelOrder?: (id: string) => void;
  remainingVolume: number;

  constructor(order: Partial<OrderModel>) {
    extendObservable(this, order);
  }
}

export default OrderModel;
