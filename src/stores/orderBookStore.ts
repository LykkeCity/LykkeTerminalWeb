import {action, computed, observable, runInAction} from 'mobx';
import {OrderBookApi} from '../api/index';
import {OrderBookModel} from '../models/index';
import {BaseStore, RootStore} from './index';

class OrderBookStore extends BaseStore {
  @computed
  get allOrders() {
    return this.orders;
  }

  @computed
  get maxAskValue() {
    return +this.maxAsk.toFixed(2);
  }

  @computed
  get maxBidValue() {
    return +this.maxBid.toFixed(2);
  }

  @observable private orders: any[] = [];
  @observable private maxAsk: number = 0;
  @observable private maxBid: number = 0;

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

      current.Levels.sort(
        (a: any, b: any) =>
          current.IsBuy ? a.Price - b.Price : b.Price - a.Price
      );

      if (current.IsBuy) {
        const bidLength = current.Levels.length;
        this.maxBid = current.Levels[bidLength - 1].Price;
      } else {
        this.maxAsk = current.Levels[0].Price;
      }

      const sliced: any[] = current.Levels.slice(0, 10);

      if (current.IsBuy) {
        maxPrice = current.Levels[current.Levels.length - 1];
        maxPrice.bestBid = true;

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
          ask: item.bestBid ? '' : item.isBuy ? item.Volume : 0,
          bestBid: item.bestBid || false,
          bid: item.bestBid ? '' : item.isBuy ? 0 : item.Volume,
          id: index,
          price: item.Price,
          timestamp: new Date(item.timestamp).toLocaleTimeString()
        })
    );
  };
}

export default OrderBookStore;
