import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {compose, curry, head, last, reverse, sortBy, take} from 'rambda';
import {OrderBookApi} from '../api';
import * as topics from '../api/topics';
import {LEVELS_COUNT} from '../components/OrderBook';
import {Order, Side} from '../models/index';
import {precisionFloor} from '../utils/math';
import {BaseStore, RootStore} from './index';
import {aggregateOrders, connectLimitOrders} from './orderBookHelpers';

import LevelType from '../models/levelType';
import {switchcase} from '../utils/fn';

import OrderBookCellType from '../models/orderBookCellType';

import greenlet from 'greenlet';

// help tsc to infer correct type
const headArr: <T = Order>(l: T[]) => T = head;
const sortByPrice = sortBy(x => x.price);

const mapToOrderWorker = greenlet((levels: any, side: Side) => {
  return levels.map((l: any) => {
    return {
      id: l.Id,
      price: l.Price,
      timestamp: l.DateTime,
      volume: l.Volume,
      depth: 0,
      side,
      orderVolume: 0,
      connectedLimitOrders: []
    };
  });
});

class OrderBookStore extends BaseStore {
  rawBids: Order[] = [];
  rawAsks: Order[] = [];
  drawAsks: any;
  drawBids: any;
  spreadUpdateFn: any;

  @observable
  myOrders = {
    position: {top: 0, left: 0},
    orders: [],
    volume: 0,
    onCancel: undefined
  };

  @observable hasPendingItems: boolean = true;
  @observable spanMultiplierIdx = 0;

  @computed
  get seedSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return Math.pow(10, -this.rootStore.uiStore.selectedInstrument.accuracy);
    }
    return 0;
  }

  @computed
  get spanMultiplier() {
    return Math.pow(10, this.spanMultiplierIdx);
  }

  @computed
  get maxMultiplierIdx() {
    if (this.rawAsks.length > 0) {
      const sortByPriceDesc = compose(headArr, reverse, sortByPrice);
      const bestAsk = sortByPriceDesc(this.rawAsks).price;
      return Math.floor(Math.log10(bestAsk / this.seedSpan));
    }
    return 0;
  }

  @computed
  get span() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return precisionFloor(
        this.seedSpan * this.spanMultiplier,
        this.rootStore.uiStore.selectedInstrument.accuracy
      );
    }
    return 0;
  }

  private subscriptions: Set<ISubscription> = new Set();

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  setAsksDrawingHandler = (cb: any) => (this.drawAsks = cb);
  setBidsDrawingHandler = (cb: any) => (this.drawBids = cb);
  setSpreadHandler = (cb: any) => (this.spreadUpdateFn = cb);

  getAsks = () => {
    const {limitOrdersForThePair: limitOrders} = this.rootStore.orderListStore;
    return take(
      LEVELS_COUNT,
      connectLimitOrders(
        aggregateOrders(this.rawAsks, this.span, true),
        limitOrders,
        this.span,
        true
      )
    );
  };

  getBids = () => {
    const {limitOrdersForThePair: limitOrders} = this.rootStore.orderListStore;
    return take(
      LEVELS_COUNT,
      connectLimitOrders(
        aggregateOrders(this.rawBids, this.span, false),
        limitOrders,
        this.span,
        false
      )
    );
  };

  bestBid = () =>
    this.rawBids.length && last(sortBy(x => x.price, this.rawBids)).price;

  bestAsk = () =>
    this.rawAsks.length && head(sortBy(x => x.price, this.rawAsks)).price;

  mid = () => (this.bestAsk() + this.bestBid()) / 2;

  getSpreadRelative = () => {
    return (this.bestAsk() - this.bestBid()) / this.bestAsk();
  };

  @action
  nextSpan = () => {
    if (this.spanMultiplierIdx < this.maxMultiplierIdx) {
      this.spanMultiplierIdx++;
    }
    this.drawBids(this.getAsks(), this.getBids(), LevelType.Bids);
    this.drawAsks(this.getAsks(), this.getBids(), LevelType.Asks);
  };

  @action
  prevSpan = () => {
    if (this.spanMultiplierIdx > 0) {
      this.spanMultiplierIdx--;
    }
    this.drawBids(this.getAsks(), this.getBids(), LevelType.Bids);
    this.drawAsks(this.getAsks(), this.getBids(), LevelType.Asks);
  };

  @action
  showMyOrders = (myOrders: any) => {
    Object.assign(this.myOrders, myOrders);
  };

  fetchAll = async () => {
    const {selectedInstrument} = this.rootStore.uiStore;
    if (selectedInstrument) {
      this.hasPendingItems = true;
      const orders = await this.api
        .fetchAll(selectedInstrument.id)
        .catch(() => {
          this.hasPendingItems = false;
        });
      this.hasPendingItems = false;
      runInAction(() => {
        orders.forEach((levels: any) => this.onNextOrders([levels]));
      });
    }
  };

  subscribe = async (ws: any) => {
    const topic = curry(topics.orderBook)(
      this.rootStore.uiStore.selectedInstrument!.id
    );
    this.subscriptions.add(
      await ws.subscribe(topic(Side.Buy), this.onNextOrders)
    );
    this.subscriptions.add(
      await ws.subscribe(topic(Side.Sell), this.onNextOrders)
    );
  };

  onNextOrders = (args: any) => {
    const {IsBuy, Levels} = args[0];
    // const {selectedInstrument} = this.rootStore.uiStore;
    // if (selectedInstrument && selectedInstrument.id === AssetPair) {
    if (IsBuy) {
      mapToOrderWorker(Levels, Side.Buy).then((orders: any) => {
        this.rawBids = orders.map((o: any) => Order.create(o));
        this.drawBids(this.getAsks(), this.getBids(), LevelType.Bids);
      });
    } else {
      mapToOrderWorker(Levels, Side.Sell).then((orders: any) => {
        this.rawAsks = orders.map((o: any) => Order.create(o));
        this.drawAsks(this.getAsks(), this.getBids(), LevelType.Asks);
      });
    }
    this.spreadUpdateFn();
    // }
  };

  unsubscribe = async () => {
    const promises = Array.from(this.subscriptions).map(s => {
      // tslint:disable-next-line:no-unused-expression
      this.getWs() && this.getWs().unsubscribe(s);
    });
    await Promise.all(promises);

    if (this.subscriptions.size > 0) {
      this.subscriptions.clear();
    }
  };

  setOrderPrice = (value: number, side: Side) => {
    this.rootStore.uiOrderStore.handlePriceClickFromOrderBook(value, side);
  };

  setOrderVolume = (value: number, side: Side) => {
    const orderSide = side === Side.Sell ? Side.Buy : Side.Sell;
    this.rootStore.uiOrderStore.handleVolumeClickFromOrderBook(
      value,
      orderSide
    );
  };

  triggerOrderUpdate = ({type, value, side}: any) => {
    switchcase({
      [OrderBookCellType.Price]: this.setOrderPrice,
      [OrderBookCellType.Volume]: this.setOrderVolume,
      [OrderBookCellType.Depth]: this.setOrderVolume
    })(type)(value, side);
  };

  reset = () => {
    this.rawBids = this.rawAsks = [];
    this.spanMultiplierIdx = 0;
    this.unsubscribe();
  };
}

export default OrderBookStore;
