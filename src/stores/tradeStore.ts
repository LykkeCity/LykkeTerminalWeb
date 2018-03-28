import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy} from 'rambda';
import {TradeApi} from '../api/index';
import * as topics from '../api/topics';
import {TradeFilter, TradeModel} from '../models/index';
import TradeQuantity from '../models/tradeLoadingQuantity';
import * as map from '../models/tradeModel.mapper';
import {nextSkip} from '../utils';
import {BaseStore, RootStore} from './index';

const sortByDate = compose<TradeModel[], TradeModel[], TradeModel[]>(
  reverse,
  sortBy((o: TradeModel) => new Date(o.timestamp).getTime())
);

class TradeStore extends BaseStore {
  @observable filter = TradeFilter.CurrentAsset;
  @observable shouldFetchMore = false;
  @observable hasPendingItems: boolean = false;

  @observable.shallow private trades: TradeModel[] = [];
  @observable.shallow private publicTrades: TradeModel[] = [];

  @computed
  get getAllTrades() {
    return sortByDate(this.trades);
  }

  @computed
  get getPublicTrades() {
    return sortByDate(this.publicTrades);
  }

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  @computed
  get instruments() {
    return this.rootStore.referenceStore.getInstruments();
  }

  @computed
  get instrumentIdByFilter() {
    return this.filter === TradeFilter.CurrentAsset
      ? this.selectedInstrument!.id
      : '';
  }

  private subscriptions: Set<ISubscription> = new Set();

  private skip: number = TradeQuantity.Skip;
  private receivedFromWamp: number = 0;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action
  addTrade = (trade: TradeModel) => {
    this.trades.push(trade);
  };

  @action
  addTrades = (trades: TradeModel[]) => {
    this.trades = this.trades.concat(trades);
  };

  @action
  addPublicTrades = (trades: TradeModel[]) => {
    this.publicTrades = this.publicTrades.concat(trades);
  };

  @action
  setFilter = (filter: TradeFilter) => {
    this.filter = filter;
    this.shouldFetchMore = false;
    this.resetTrades();
    this.fetchTrades();
  };

  fetchTrades = async () => {
    if (this.selectedInstrument) {
      this.hasPendingItems = true;
      const trades = await this.api.fetchTrades(
        this.instrumentIdByFilter,
        this.skip,
        TradeQuantity.Take
      );
      const limitTrades = await this.api.fetchLimitTrades(
        this.instrumentIdByFilter,
        this.skip,
        TradeQuantity.Take
      );
      this.hasPendingItems = false;
      runInAction(() => {
        this.addTrades(
          map.aggregateTradesByTimestamp(
            [...trades, ...limitTrades],
            this.instruments
          )
        );
        this.shouldFetchMore =
          trades.length === TradeQuantity.Take ||
          limitTrades.length === TradeQuantity.Take;
      });
    }
  };

  fetchNextTrades = async () => {
    this.skip = nextSkip(this.skip, TradeQuantity.Take, this.receivedFromWamp);
    this.fetchTrades();
  };

  fetchPublicTrades = async () => {
    if (this.selectedInstrument) {
      const resp = await this.api.fetchPublicTrades(
        this.selectedInstrument.id,
        TradeQuantity.Skip,
        TradeQuantity.Take
      );
      runInAction(() => {
        this.publicTrades = resp.map(map.fromRestToPublicTrade);
      });
    }
  };

  subscribe = (ws: any) => {
    ws.subscribe(topics.trades, this.onTrades);
  };

  onTrades = async (args: any[]) => {
    this.receivedFromWamp += 2;
    this.addTrade(map.fromWampToTrade(args[0], this.instruments));
  };

  subscribeToPublicTrades = async () => {
    this.subscriptions.add(
      await this.getWs().subscribe(
        topics.publicTrade(this.selectedInstrument!.id),
        this.onPublicTrades
      )
    );
  };

  onPublicTrades = (args: any[]) => {
    this.addPublicTrades(args.map(map.fromWampToPublicTrade));
  };

  unsubscribeFromPublicTrades = async () => {
    const subscriptions = Array.from(this.subscriptions).map(
      this.getWs().unsubscribe
    );
    await Promise.all(subscriptions);
    this.subscriptions.clear();
  };

  @action
  resetTrades = () => {
    this.trades = [];
    this.skip = 0;
    this.receivedFromWamp = 0;
  };

  @action
  reset = () => {
    this.resetTrades();
    this.publicTrades = [];
  };
}

export default TradeStore;
