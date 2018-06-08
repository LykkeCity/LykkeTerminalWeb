import {ISubscription} from 'autobahn';
import {action, computed, observable} from 'mobx';
import {compose, curry, head, reverse, sortBy, take} from 'rambda';
import {OrderBookApi} from '../api';
import * as topics from '../api/topics';
import {LEVELS_COUNT} from '../components/OrderBook';
import {LevelType, Order, OrderBookCellType, Side} from '../models/index';
import {OrderLevel} from '../models/order';
import {switchcase} from '../utils/fn';
import {precisionFloor} from '../utils/math';
import {BaseStore, RootStore} from './index';
import {
  aggregateOrders,
  connectLimitOrders,
  getLevel,
  mapToOrder
} from './orderBookHelpers';

// help tsc to infer correct type
const headArr: <T = Order>(l: T[]) => T = head;
const sortByPrice = sortBy(x => x.price);

class OrderBookStore extends BaseStore {
  rawBids: Order[] = [];
  rawAsks: Order[] = [];
  drawAsks: (asks: Order[], bids: Order[], type: LevelType) => void;
  drawBids: (asks: Order[], bids: Order[], type: LevelType) => void;
  spreadUpdateFn: () => void;
  midPriceUpdaters: any[] = [];
  updateDepthChart: any;
  getLevel: (l: any[], idx: number) => Promise<Order>;
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

  constructor(
    store: RootStore,
    private readonly api: OrderBookApi,
    private readonly worker: any
  ) {
    super(store);
    this.getLevel = this.worker(getLevel);
    this.mapToOrderInWorker = this.worker(mapToOrder);
  }

  setAsksUpdatingHandler = (cb: any) => (this.drawAsks = cb);
  setBidsUpdatingHandler = (cb: any) => (this.drawBids = cb);
  setSpreadHandler = (cb: any) => (this.spreadUpdateFn = cb);
  setMidPriceUpdateHandler = (cb: any) => this.midPriceUpdaters.push(cb);
  setDepthChartUpdatingHandler = (cb: any) => (this.updateDepthChart = cb);
  handleDepthChartUnmount = () => (this.updateDepthChart = null);

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

  bestBid = async () => {
    const bestBid = await this.getLevel(this.rawBids, this.rawBids.length - 1);
    return !!bestBid ? bestBid.price : 0;
  };

  bestAsk = async () => {
    const bestAsk = await this.getLevel(this.rawAsks, 0);
    return !!bestAsk ? bestAsk.price : 0;
  };

  mid = async () => {
    const bestAsk = await this.bestAsk();
    const bestBid = await this.bestBid();
    return (bestAsk + bestBid) / 2;
  };

  getSpreadRelative = async () => {
    const bestAsk = await this.bestAsk();
    const bestBid = await this.bestBid();
    return (bestAsk - bestBid) / bestAsk;
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
      const promises = orders.map(
        async (levels: any) => await this.onNextOrders([levels])
      );
      return Promise.all(promises).then(() =>
        this.midPriceUpdaters.forEach((fn: any) => fn(this.mid))
      );
    }
    return Promise.resolve();
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

  onNextOrders = async (args: any) => {
    const {AssetPair, IsBuy, Levels} = args[0];
    const {selectedInstrument} = this.rootStore.uiStore;
    if (selectedInstrument && selectedInstrument.id === AssetPair) {
      if (IsBuy) {
        const bids = await this.mapToOrderInWorker(Levels, Side.Buy);
        this.rawBids = bids.map((b: any) => Order.create(b));
        this.drawBids(this.getAsks(), this.getBids(), LevelType.Bids);
      } else {
        const asks = await this.mapToOrderInWorker(Levels, Side.Sell);
        this.rawAsks = asks.map((a: any) => Order.create(a));
        this.drawAsks(this.getAsks(), this.getBids(), LevelType.Asks);
      }
      // tslint:disable:no-unused-expression
      this.updateDepthChart && this.updateDepthChart();
      this.spreadUpdateFn && this.spreadUpdateFn();
    }
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
