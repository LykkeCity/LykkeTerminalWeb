import {observable} from 'mobx';
import {Side} from './index';

export interface OrderLevel {
  id: string;
  volume: number;
  price: number;
  timestamp: any;
  side: Side;
  depth: number;
  orderVolume: number;
  connectedLimitOrders: string[];
}

export class Order {
  static create = (order: Partial<Order>) => Object.assign(new Order(), order);

  id: string;
  @observable volume: number;
  @observable price: number;
  timestamp: any;
  side: Side;
  @observable depth: number;
  orderVolume: number;
  @observable.shallow connectedLimitOrders: string[];
}

export default Order;
