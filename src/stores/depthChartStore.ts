import {action, computed, observable} from 'mobx';
import {reverse} from 'rambda';
import chart from '../components/DepthChart/Chart/chartConstants';
import {Order, TradeModel} from '../models';
import {precisionFloor} from '../utils/math';
import {BaseStore, RootStore} from './index';
import {aggregateOrders, connectLimitOrders} from './orderBookHelpers';

class DepthChartStore extends BaseStore {
  multiplers: number[] = [0, 1, 0.75, 0.5, 0.25, 0.1, 0.05, 0.025];
  maxMultiplier = this.multiplers.length - 1;
  @observable spanMultiplierIdx = 3;
  @observable width: number = 1024;
  @observable height: number = 512;
  @observable labelsWidth: number = chart.labelsWidth;
  @observable asks: Order[] = [];
  @observable bids: Order[] = [];

  @computed
  get span() {
    return this.multiplers[this.spanMultiplierIdx] * 100;
  }

  @computed
  get seedSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return Math.pow(10, -this.rootStore.uiStore.selectedInstrument.accuracy);
    }
    return 0;
  }

  @computed
  get instrumentSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return precisionFloor(
        this.seedSpan * 1,
        this.rootStore.uiStore.selectedInstrument.accuracy
      );
    }
    return 0;
  }

  constructor(store: RootStore) {
    super(store);
  }

  reduceBidsArray = (bids: Order[]) => {
    const maximum = Math.max(...bids.map(b => b.price));
    const lowerBound =
      maximum - maximum * this.multiplers[this.spanMultiplierIdx];
    const filteredBids = bids.filter(bid => bid.price > lowerBound);
    return filteredBids.length ? filteredBids : bids.slice(0, 1);
  };

  reduceAsksArray = (asks: Order[]) => {
    const minimum = Math.min(...asks.map(a => a.price));
    const upperBound =
      minimum + minimum * this.multiplers[this.spanMultiplierIdx];
    const filteredAsks = asks.filter(ask => ask.price < upperBound);
    return filteredAsks.length
      ? filteredAsks
      : asks.slice(asks.length - 1, asks.length);
  };

  @computed
  get getBids() {
    const {
      orderListStore: {limitOrdersForThePair: limitOrders}
    } = this.rootStore;
    const aggregatedOrders = aggregateOrders(
      this.bids,
      this.instrumentSpan,
      false
    );
    return this.reduceBidsArray(
      connectLimitOrders(aggregatedOrders, limitOrders, this.span, false)
    );
  }

  @computed
  get getAsks() {
    const {
      orderListStore: {limitOrdersForThePair: limitOrders}
    } = this.rootStore;
    const aggregatedOrders = aggregateOrders(
      this.asks,
      this.instrumentSpan,
      true
    );
    return this.reduceAsksArray(
      reverse(
        connectLimitOrders(aggregatedOrders, limitOrders, this.span, true)
      )
    );
  }

  updateAsks = (asks: Order[]) => (this.asks = asks);
  updateBids = (bids: Order[]) => (this.bids = bids);

  mid = async () => await this.rootStore.orderBookStore.mid();

  spread = async () => {
    const bestAsk = await this.rootStore.orderBookStore.getBestAsk();
    const bestBid = await this.rootStore.orderBookStore.getBestBid();
    return (bestAsk - bestBid) / bestAsk * 100;
  };

  lastTradePrice = () => {
    const trades: TradeModel[] = this.rootStore.tradeStore.getAllTrades;
    return trades[0] ? trades[0]!.price : 0;
  };

  @action
  nextSpan = () => {
    if (this.spanMultiplierIdx < this.maxMultiplier) {
      this.spanMultiplierIdx++;
    }
  };

  @action
  prevSpan = () => {
    if (this.spanMultiplierIdx > 1) {
      this.spanMultiplierIdx--;
    }
  };

  @action
  setWidth = (width: number) => {
    this.width = width;
  };

  @action
  setHeight = (height: number) => {
    this.height = height;
  };

  @action
  setLabelsWidth = (width: number) => {
    this.labelsWidth = width > chart.labelsWidth ? width : chart.labelsWidth;
  };

  @computed
  get isMaxZoom(): boolean {
    return (
      this.multiplers[this.spanMultiplierIdx] ===
      this.multiplers[this.multiplers.length - 1]
    );
  }

  @computed
  get isMinZoom(): boolean {
    return this.multiplers[this.spanMultiplierIdx] === this.multiplers[1];
  }

  reset = () => {
    this.spanMultiplierIdx = 1;
  };
}

export default DepthChartStore;
