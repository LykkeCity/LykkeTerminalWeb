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
      const sliced: any[] = current.Levels.sort(
        (a: any, b: any) =>
          current.IsBuy ? a.Price - b.Price : b.Price - a.Price
      ).slice(0, 5);

      sliced.forEach((item: any) => {
        item.timestamp = current.Timestamp;
        item.isBuy = current.IsBuy;
      });

      return prev.concat(sliced);
    }, []);

    return arr.map(
      (item: any, index: number) =>
        new OrderBookModel({
          ask: item.isBuy ? item.Volume : 0,
          bid: item.isBuy ? 0 : item.Volume,
          id: index,
          price: item.Price,
          timestamp: new Date(item.timestamp).toLocaleTimeString()
        })
    );
  };
}

export default OrderBookStore;
