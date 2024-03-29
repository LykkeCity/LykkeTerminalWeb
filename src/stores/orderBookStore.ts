import {IWampSubscriptionItem} from '@lykkex/subzero-wamp';
import {action, computed, observable} from 'mobx';
import {compose, curry, head, reverse, sortBy, take} from 'rambda';
import {OrderBookApi} from '../api';
import * as topics from '../api/topics';
import {LEVELS_COUNT} from '../components/OrderBook';
import {AnalyticsEvents} from '../constants/analyticsEvents';
import {LevelType, Order, OrderBookCellType, Side} from '../models/index';
import {OrderLevel} from '../models/order';
import AnalyticsService from '../services/analyticsService';
import {switchcase} from '../utils/fn';
import {pow, precisionFloor, times} from '../utils/math';
import {getDigits} from '../utils/number';
import {BaseStore, RootStore} from './index';
import {
  aggregateOrders,
  connectLimitOrders,
  getSortedByPriceLevel,
  mapToOrder
} from './orderBookHelpers';

// help tsc to infer correct type
const headArr: <T = Order>(l: T[]) => T = head;
const sortByPrice = sortBy(x => x.price);

const DEFAULT_ACCURACY = 2;

class OrderBookStore extends BaseStore {
  rawBids: Order[] = [];
  rawAsks: Order[] = [];
  drawAsks: (asks: Order[], bids: Order[], type: LevelType) => void;
  drawBids: (asks: Order[], bids: Order[], type: LevelType) => void;
  getSortedByPriceLevel: (l: any[], idx: number) => Promise<Order>;
  mapToOrderInWorker: (l: any[], side: Side) => Promise<OrderLevel[]>;

  @observable
  myOrders = {
    position: {top: 0, left: 0},
    orders: [],
    volume: 0,
    onCancel: undefined
  };

  @observable hasPendingItems: boolean = true;
  @observable spanMultiplierIdx = 0;
  @observable bestAskPrice: number = 0;
  @observable bestBidPrice: number = 0;
  @observable spread: number = 0;
  @observable midPrice: number = 0;

  @computed
  get seedSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return pow(10, -this.rootStore.uiStore.selectedInstrument.accuracy);
    }
    return 0;
  }

  @computed
  get spanMultiplier() {
    return Math.pow(10, this.spanMultiplierIdx);
  }

  @computed
  get maxMultiplierIdx() {
    const levels = this.rawAsks.length ? this.rawAsks : this.rawBids;
    if (levels.length) {
      const sortByPriceDesc = compose<Order[], Order[], Order[], Order>(
        headArr,
        reverse,
        sortByPrice
      );
      const bestLevel = sortByPriceDesc(levels).price;
      return Math.floor(Math.log10(bestLevel / this.seedSpan));
    }
    return 0;
  }

  @computed
  get span() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return precisionFloor(
        times(this.seedSpan, this.spanMultiplier).toNumber(),
        this.rootStore.uiStore.selectedInstrument.accuracy
      );
    }
    return 0;
  }

  @computed
  get spanAccuracy() {
    if (!!this.spanHandlers.size) {
      this.spanHandlers.forEach((cb: () => void) => cb());
    }

    return this.rootStore.uiStore.selectedInstrument
      ? getDigits(times(this.seedSpan, this.spanMultiplier).toNumber())
      : DEFAULT_ACCURACY;
  }

  private subscriptions: Set<IWampSubscriptionItem> = new Set();
  private spanHandlers: Map<LevelType, () => void> = new Map();

  constructor(
    store: RootStore,
    private readonly api: OrderBookApi,
    private readonly worker: any
  ) {
    super(store);
    this.getSortedByPriceLevel = this.worker(getSortedByPriceLevel);
    this.mapToOrderInWorker = this.worker(mapToOrder);
  }

  setAsksUpdatingHandler = (
    cb: (asks: Order[], bids: Order[], levelType: LevelType) => void
  ) => (this.drawAsks = cb);
  setBidsUpdatingHandler = (
    cb: (asks: Order[], bids: Order[], levelType: LevelType) => void
  ) => (this.drawBids = cb);
  setSpanUpdatingHandler = (levelType: LevelType, cb: () => void) =>
    this.spanHandlers.set(levelType, cb);

  drawOrderBook = () => {
    this.drawBids(this.getAsks(), this.getBids(), LevelType.Bids);
    this.drawAsks(this.getAsks(), this.getBids(), LevelType.Asks);
  };

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

  getBestBid = async () => {
    const bestBid = await this.getSortedByPriceLevel(
      this.rawBids,
      this.rawBids.length - 1
    );
    return !!bestBid ? bestBid.price : 0;
  };

  getBestAsk = async () => {
    const bestAsk = await this.getSortedByPriceLevel(this.rawAsks, 0);
    return !!bestAsk ? bestAsk.price : 0;
  };

  mid = async () => {
    const bestAsk = await this.getBestAsk();
    const bestBid = await this.getBestBid();
    return (bestAsk + bestBid) / 2;
  };

  @action
  nextSpan = () => {
    if (this.spanMultiplierIdx < this.maxMultiplierIdx) {
      this.spanMultiplierIdx++;
    }
    this.drawOrderBook();
    AnalyticsService.track(AnalyticsEvents.GroupOrderBook);
  };

  @action
  prevSpan = () => {
    if (this.spanMultiplierIdx > 0) {
      this.spanMultiplierIdx--;
    }
    this.drawOrderBook();
    AnalyticsService.track(AnalyticsEvents.GroupOrderBook);
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
      const promises = orders.map(
        async (levels: any) => await this.onNextOrders([levels])
      );
      return Promise.all(promises);
    }
    return Promise.resolve();
  };

  subscribe = async () => {
    const topic = curry(topics.orderBook)(
      this.rootStore.uiStore.selectedInstrument!.id
    );
    this.subscriptions.add(
      await this.rootStore.socketStore.subscribe(
        topic(Side.Buy),
        this.onNextOrders
      )
    );
    this.subscriptions.add(
      await this.rootStore.socketStore.subscribe(
        topic(Side.Sell),
        this.onNextOrders
      )
    );
  };

  onNextOrders = async (args: any) => {
    const {AssetPair, IsBuy, Levels} = args[0];
    const {selectedInstrument} = this.rootStore.uiStore;
    if (selectedInstrument && selectedInstrument.id === AssetPair) {
      if (IsBuy) {
        const bids = await this.mapToOrderInWorker(Levels, Side.Buy);
        this.rawBids = bids.map((b: any) => Order.create(b));
        this.drawBids(this.getAsks(), this.getBids(), LevelType.Bids);
        this.rootStore.depthChartStore.updateBids(this.rawBids);
        this.bestBidPrice = await this.getBestBid();
      } else {
        const asks = await this.mapToOrderInWorker(Levels, Side.Sell);
        this.rawAsks = asks.map((a: any) => Order.create(a));
        this.drawAsks(this.getAsks(), this.getBids(), LevelType.Asks);
        this.rootStore.depthChartStore.updateAsks(this.rawAsks);
        this.bestAskPrice = await this.getBestAsk();
      }
      this.spread = (this.bestAskPrice - this.bestBidPrice) / this.bestAskPrice;
      this.midPrice = (this.bestAskPrice + this.bestBidPrice) / 2;
    }
    this.rootStore.uiOrderStore.setMarketTotal();
  };

  unsubscribe = async () => {
    const promises = Array.from(this.subscriptions).map(subscription =>
      this.rootStore.socketStore.unsubscribe(
        subscription.topic,
        subscription.id
      )
    );
    if (this.subscriptions.size > 0) {
      this.subscriptions.clear();
    }
    await Promise.all(promises);
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

  reset = async () => {
    this.rawBids = this.rawAsks = [];
    this.spanMultiplierIdx = 0;
    await this.unsubscribe();
  };
}

export default OrderBookStore;
