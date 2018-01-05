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
    return +this.maxAsk.toFixed(this.instrument!.accuracy);
  }

  @computed
  get maxBidValue() {
    return +this.maxBid.toFixed(this.instrument!.accuracy);
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
          process.env.REACT_APP_REQ_INTERVAL || 10000
        ))
    );
  };

  reset = () => {
    this.orders = [];
  };

  calcMidPrice = (orders: OrderBookModel[]) => {
    const minAsk = orders
      .filter(order => !order.isBuy)
      .sort((a, b) => a.price - b.price)[0].price;
    const maxBid = orders
      .filter(order => order.isBuy)
      .sort((a, b) => b.price - a.price)[0].price;
    return (minAsk + maxBid) / 2;
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
          isBuy: item.isBuy,
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
