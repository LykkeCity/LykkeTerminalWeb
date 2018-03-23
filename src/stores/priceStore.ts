import {ISubscription} from 'autobahn';
import {computed, observable} from 'mobx';
import {BaseStore, RootStore} from '.';
import * as topics from '../api/topics';
import {MarketType, PriceType} from '../models';

class PriceStore extends BaseStore {
  @observable lastTradePrice: number;
  @observable dailyHigh: number;
  @observable dailyLow: number;
  @observable dailyOpen: number;
  @observable dailyVolume: number;

  private subscriptions: Set<ISubscription> = new Set();

  @computed
  get dailyChange() {
    return (this.lastTradePrice - this.dailyOpen) / this.dailyOpen;
  }

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  constructor(store: RootStore) {
    super(store);
  }

  subscribeToDailyCandle = async () => {
    this.subscriptions.add(
      await this.getWs().subscribe(
        topics.candle(
          MarketType.Spot,
          this.selectedInstrument!.id,
          PriceType.Trade,
          'day'
        ),
        this.onDailyTradeCandle
      )
    );
  };

  onDailyTradeCandle = (args: any[]) => {
    const {o, h, l, c, v} = args[0];
    this.dailyOpen = o;
    this.dailyHigh = h;
    this.dailyLow = l;
    this.lastTradePrice = c;
    this.dailyVolume = v;
  };

  unsubscribeFromDailyCandle = async () => {
    const subscriptions = Array.from(this.subscriptions).map(
      this.getWs().unsubscribe
    );
    await Promise.all(subscriptions);
    this.subscriptions.clear();
  };

  reset = () => {
    this.lastTradePrice = 0;
    this.dailyHigh = 0;
    this.dailyLow = 0;
    this.dailyOpen = 0;
    this.dailyVolume = 0;
    this.unsubscribeFromDailyCandle();
  };
}

export default PriceStore;
