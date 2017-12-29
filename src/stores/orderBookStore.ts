import {action, computed, observable, runInAction} from 'mobx';
import {OrderBookApi} from '../api/index';
import {OrderBookModel} from '../models/index';
import {BaseStore, RootStore} from './index';

class OrderBookStore extends BaseStore {
  @computed
  get allOrders() {
    return this.orders;
  }

  @observable private orders: any[] = [];

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  @action
  addOrder = (order: OrderBookModel) => (this.orders = [...this.orders, order]);

  fetchAll = () => {
    const getOrders = async () => {
      let resp: any[];

      await this.api.fetchAll('btcusd').then(res => {
        resp = this.sortOrders(res);
      });

      runInAction(() => {
        this.orders = resp;
      });
    };

    return getOrders().then(() =>
      setInterval(getOrders, process.env.REACT_APP_REQ_INTERVAL)
    );
  };

  reset = () => {
    this.orders = [];
  };

  private sortOrders = (orders: any) => {
    const arr: any[] = orders.reduce((prev: any, current: any) => {
      let maxPrice: any;
      let sliced: any[];

      const depth: number = 10;
      const desc = (a: any, b: any) => b.Price - a.Price;

      current.Levels.sort(desc);

      if (current.IsBuy) {
        maxPrice = current.Levels.splice(0, 1)[0];
        maxPrice.bestBid = true;
      }

      // IsBuy: true - bid; IsBuy: false - ask
      sliced = current.IsBuy
        ? current.Levels.slice(0, depth)
        : current.Levels.slice(-depth);

      if (maxPrice) {
        sliced.unshift(maxPrice);
      }

      sliced.forEach((item: any) => {
        item.timestamp = current.Timestamp;
        item.isBuy = current.IsBuy;
      });

      return prev.concat(sliced);
    }, []);

    return arr.map(
      (item: any, index: number) =>
        new OrderBookModel({
          ask: item.bestBid ? '' : item.isBuy ? '' : item.Volume,
          bestBid: item.bestBid || false,
          bid: item.bestBid ? '' : item.isBuy ? item.Volume : '',
          id: index,
          price: item.Price,
          timestamp: new Date(item.timestamp).toLocaleTimeString()
        })
    );
  };
}

export default OrderBookStore;
