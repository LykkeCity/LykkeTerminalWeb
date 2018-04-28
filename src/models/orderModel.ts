import {computed, extendObservable} from 'mobx';
import {precisionCeil, precisionFloor} from '../utils/math';
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
  accuracy: number;

  @computed
  get filled() {
    return this.volume - this.remainingVolume;
  }

  @computed
  get filledPercent() {
    return this.filled !== 0 ? this.remainingVolume / this.volume : 0;
  }

  @computed
  get value() {
    return this.side === Side.Buy
      ? precisionCeil(this.price * this.volume, this.accuracy)
      : precisionFloor(this.price * this.volume, this.accuracy);
  }

  constructor(order: Partial<OrderModel>) {
    extendObservable(this, order);
  }
}

export default OrderModel;
