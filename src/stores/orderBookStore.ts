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
  private pollingInterval: any;
  @observable private maxAsk: number = 0;
  @observable private maxBid: number = 0;

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  @action
  addOrder = (order: OrderBookModel) => (this.orders = [...this.orders, order]);

  fetchAll = () => {
    this.pollingInterval = null;

    const getOrders = async () => {
      let resp: any[];

      if (this.instrument) {
        await this.api
          .fetchAll(this.instrument!.id)
          .then(res => (resp = this.sortOrders(res)));

        runInAction(() => (this.orders = resp));
      }
    };

    return getOrders().then(
      () =>
        (this.pollingInterval = setInterval(
          getOrders,
          process.env.REACT_APP_REQ_INTERVAL
        ))
    );
  };

  reset = () => {
    this.orders = [];
  };

  calcMidPrice = (orders: OrderBookModel[]) => {
    const midIdx = orders.length / 2;
    const prevIdx = midIdx - 1 < 0 ? 0 : midIdx - 1;
    const prevEl = orders[prevIdx];
    const nextEl = orders[midIdx];
    return (prevEl.price + nextEl.price) / 2;
  };

  placeInMiddle = (orders: any[], val: any = {}) => {
    if (orders.length % 2 > 0) {
      return orders;
    }
    const mid = orders.length / 2;
    return [...orders.slice(0, mid), val, ...orders.slice(mid)];
  };

  private sortOrders = (orders: any) => {
    const depth: number = 10;
    const arr: any[] = orders.reduce((prev: any, current: any) => {
      let maxPrice: any;
      let sliced: any[];

      const desc = (a: any, b: any) => b.Price - a.Price;

      current.Levels.sort(desc);

      if (current.IsBuy) {
        maxPrice = current.Levels.splice(0, 1)[0];
        maxPrice.bestBid = true;
        this.maxBid = maxPrice.Price;
      } else {
        this.maxAsk = current.Levels[0].Price;
      }

      // IsBuy: true - bid; IsBuy: false - ask
      sliced = current.IsBuy
        ? current.Levels.slice(0, depth)
        : current.Levels.slice(-depth);

      // if (maxPrice) {
      //   sliced.unshift(maxPrice);
      // }

      sliced.forEach((item: any) => {
        item.timestamp = current.Timestamp;
        item.isBuy = current.IsBuy;
      });

      return prev.concat(sliced);
    }, []);

    const mappedOrders = arr.map(
      (item: any, index: number) =>
        new OrderBookModel({
          ask: item.bestBid ? '' : item.isBuy ? '' : Math.abs(item.Volume),
          bestBid: item.bestBid || false,
          bid: item.bestBid ? '' : item.isBuy ? Math.abs(item.Volume) : '',
          id: index,
          price: item.Price,
          timestamp: new Date(item.timestamp).toLocaleTimeString()
        })
    );
    return this.placeInMiddle(mappedOrders, {
      ask: '',
      bestBid: true,
      bid: '',
      id: -1,
      price: this.calcMidPrice(mappedOrders).toFixed(this.instrument!.accuracy),
      timestamp: Date.now()
    });
  };

  private get instrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }
}

export default OrderBookStore;
