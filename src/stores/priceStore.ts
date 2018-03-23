import {ISubscription} from 'autobahn';
import {endOfToday, startOfToday} from 'date-fns';
import {computed, observable, runInAction} from 'mobx';
import {last} from 'rambda';
import {BaseStore, RootStore} from '.';
import {PriceApi} from '../api';
import * as topics from '../api/topics';
import {MarketType, PriceType} from '../models';
import * as map from '../models/mappers';

class PriceStore extends BaseStore {
  priceApi: any;
  @observable lastTradePrice: number;
  @observable dailyHigh: number;
  @observable dailyLow: number;
  @observable dailyOpen: number;
  @observable dailyVolume: number;

  private subscriptions: Set<ISubscription> = new Set();

  @computed
  get dailyChange() {
    return (this.lastTradePrice - this.dailyOpen) / this.dailyOpen * 100;
  }

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  constructor(store: RootStore, private readonly api: PriceApi) {
    super(store);
  }

  fetchDailyCandle = async () => {
    const resp = await this.api.fetchCandles(
      this.selectedInstrument!.id,
      startOfToday(),
      endOfToday(),
      'day'
    );
    runInAction(() => {
      const {open, high, low, close, volume} = map.mapToBarFromRest(
        last(resp.History)
      );
      this.dailyOpen = open;
      this.dailyHigh = high;
      this.dailyLow = low;
      this.lastTradePrice = close;
      this.dailyVolume = volume;
    });
  };

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
    const {open, high, low, close, volume} = map.mapToBarFromWamp(args[0]);
    this.dailyOpen = open;
    this.dailyHigh = high;
    this.dailyLow = low;
    this.lastTradePrice = close;
    this.dailyVolume = volume;
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
