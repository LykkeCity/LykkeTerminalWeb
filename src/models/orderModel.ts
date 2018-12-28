import {computed, extendObservable} from 'mobx';
import {Side} from './index';
import {OrderType} from './orderType';

class OrderModel {
  symbol: string;
  side: Side;
  volume: number;
  remainingVolume: number;
  price: number;
  stopPrice: number;
  createdAt: Date;
  id: string;
  cancelOrder?: (id: string) => void;
  type: OrderType;

  @computed
  get filled() {
    return this.volume - this.remainingVolume;
  }

  @computed
  get filledPercent() {
    return this.filled !== 0 ? this.filled / this.volume : 0;
  }

  @computed
  get value() {
    return this.price * this.volume;
  }

  constructor(order: Partial<OrderModel>) {
    extendObservable(this, order);
  }
}

export default OrderModel;
