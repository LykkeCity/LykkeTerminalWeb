import {action, computed, observable, runInAction} from 'mobx';
import {WampApi} from '../api';
import {OrderBookModel} from '../models/index';
import {BaseStore, RootStore} from './index';

class OrderBookStore extends BaseStore {
  @computed
  get allOrders() {
    return this.orders;
  }

  @computed
  get allBuyOrders() {
    return this.buyOrders;
  }

  @computed
  get allSellOrders() {
    return this.sellOrders;
  }

  @computed
  get midPriceValue() {
    return this.midPrice;
  }

  @computed
  get maxAskValue() {
    if (this.instrument) {
      return +this.maxAsk.toFixed(this.instrument!.accuracy);
    } else {
      return +this.maxAsk.toFixed(2);
    }
  }

  @computed
  get maxBidValue() {
    if (this.instrument) {
      return +this.maxBid.toFixed(this.instrument!.accuracy);
    } else {
      return +this.maxBid.toFixed(2);
    }
  }

  @observable private orders: any[] = [];
  private pollingInterval: any;
  private buySubscription: any;
  private sellSubscription: any;
  @observable private buyOrders: any[] = [];
  @observable private sellOrders: any[] = [];
  @observable private midPrice: number = 0;
  @observable private maxAsk: number = 0;
  @observable private maxBid: number = 0;

  constructor(store: RootStore) {
    super(store);
  }

  @action
  addOrder = (order: OrderBookModel) => (this.orders = [...this.orders, order]);

  fetchAll = async () => {
    this.pollingInterval = null;

    if (this.buySubscription) {
      this.buySubscription.unsubscribe();
    }

    if (this.sellSubscription) {
      this.sellSubscription.unsubscribe();
    }

    this.buySubscription = await WampApi.subscribe(
      `orderbook.${this.instrumentId.toLowerCase()}.buy`,
      this.updateBuy
    );
    this.sellSubscription = await WampApi.subscribe(
      `orderbook.${this.instrumentId.toLowerCase()}.sell`,
      this.updateSell
    );

    runInAction(() => {
      this.orders = [];
      this.sellOrders = [];
      this.buyOrders = [];
    });
  };

  reset = () => {
    this.orders = [];
  };

  calcMidPrice = (orders: OrderBookModel[]) => {
    const asks = orders.filter(order => order.ask).map(o => o.price);
    const bids = orders.filter(order => order.bid).map(o => o.price);
    const minAsk = asks.length ? Math.min(...asks) : 0;
    const maxBid = bids.length ? Math.max(...bids) : 0;
    return (minAsk + maxBid) / 2;
  };

  placeInMiddle = (orders: any[], val: any = {}) => {
    return [...orders.filter(o => o.ask), val, ...orders.filter(o => o.bid)];
  };

  updateBuy = (e: any) => {
    this.buyOrders = this.sortOrders(e[0]);
    this.updateMidPrice(this.buyOrders, undefined);
  };

  updateSell = (e: any) => {
    this.sellOrders = this.sortOrders(e[0]);
    this.updateMidPrice(undefined, this.sellOrders);
  };

  updateMidPrice = (
    buyOrders: any[] = this.buyOrders,
    sellOrders: any[] = this.sellOrders
  ) => {
    const orders = [...buyOrders, ...sellOrders];
    this.midPrice = +this.calcMidPrice(orders).toFixed(
      this.instrument!.accuracy
    );
  };

  sortOrders = (order: any) => {
    const depth: number = 10;
    let sliced: any[];

    const desc = (a: any, b: any) => b.Price - a.Price;

    order.Prices.sort(desc);

    if (order.IsBuy) {
      this.maxBid = order.Prices[0].Price;
    } else {
      this.maxAsk = order.Prices[0].Price;
    }

    // IsBuy: true - bid; IsBuy: false - ask
    sliced = order.IsBuy
      ? order.Prices.slice(0, depth)
      : order.Prices.slice(-depth);

    sliced.forEach((item: any) => {
      item.timestamp = order.Timestamp;
      item.isBuy = order.IsBuy;
    });

    return sliced.map(
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
  };

  get instrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  private get instrumentId() {
    return this.instrument!.id;
  }
}

export default OrderBookStore;
