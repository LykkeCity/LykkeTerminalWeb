import {computed, extendObservable} from 'mobx';
import {Side} from './index';

class OrderModel {
  filled: number;
  symbol: string;
  side: Side;
  volume: number;
  remainingVolume: number;
  price: number;
  createdAt: Date;
  id: string;
  cancelOrder?: (id: string) => void;

  @computed
  get filledPercent() {
    return this.filled !== 0 ? this.remainingVolume / this.volume : 0;
  }

  constructor(order: Partial<OrderModel>) {
    extendObservable(this, order);
  }
}

export default OrderModel;
