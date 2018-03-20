import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy, uniq} from 'rambda';
import {TradeApi} from '../api/index';
import * as topics from '../api/topics';
import {TradeFilter, TradeModel} from '../models/index';
import TradeQuantity from '../models/tradeLoadingQuantity';
import * as map from '../models/tradeModel.mapper';
import {BaseStore, RootStore} from './index';

const sortByDate = compose<TradeModel[], TradeModel[], TradeModel[]>(
  reverse,
  sortBy((o: TradeModel) => new Date(o.timestamp).getTime())
);

class TradeStore extends BaseStore {
  @observable filter = TradeFilter.CurrentAsset;

  @computed
  get getAllTrades() {
    return sortByDate(this.trades);
  }

  @computed
  get getPublicTrades() {
    return sortByDate(this.publicTrades);
  }

  @computed
  get needToLoadMore() {
    return this.trades.length > 0;
  }

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  @computed
  get filteredTrades() {
    return this.filter === TradeFilter.CurrentAsset
      ? this.getAllTrades.filter(t => t.symbol === this.selectedInstrument!.id)
      : this.getAllTrades;
  }

  @observable.shallow private trades: TradeModel[] = [];
  @observable.shallow private publicTrades: TradeModel[] = [];

  private subscriptions: Set<ISubscription> = new Set();

  private skip: number = TradeQuantity.Skip;
  private take: number = TradeQuantity.Take;
  private loading: number = TradeQuantity.Loading;
  private wampTrades: number = 0;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action
  setFilter = (filter: TradeFilter) => {
    this.filter = filter;
  };

  @action
  addTrades = (trades: TradeModel[]) => {
    this.trades = this.trades.concat(trades);
  };

  @action
  addPublicTrades = (trades: TradeModel[]) => {
    this.publicTrades = this.publicTrades.concat(trades);
  };

  fetchTrades = async () => {
    if (!this.selectedInstrument) {
      return;
    }
    const resp = await this.api.fetchTrades(
      this.selectedInstrument,
      this.skip,
      this.take
    );
    runInAction(() => {
      this.trades = [];
      this.addTrades(
        map.fromRestToTradeList(
          resp,
          this.selectedInstrument!.quoteAsset.accuracy
        )
      );
    });
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
    ws.subscribe(topics.trade, this.onTrades);
  };

  subscribeToPublicTrades = async () => {
    this.subscriptions.add(
      await this.getWs().subscribe(
        topics.publicTrade(this.selectedInstrument!.id),
        this.onPublicTrades
      )
    );
  };

  unsubscribeFromPublicTrades = async () => {
    const subscriptions = Array.from(this.subscriptions).map(
      this.getWs().unsubscribe
    );
    await Promise.all(subscriptions);
    this.subscriptions.clear();
  };

  fetchPartTrade = async () => {
    this.skip = this.getSkipValue('skip', 'take', 'wampTrades');
    this.fetchTrades();
  };

  onTrades = async (args: any[]) => {
    this.take += this.skip;
    this.skip = TradeQuantity.Skip;

    this.addTrades([
      map.fromWampToTrade(
        args[0],
        this.rootStore.referenceStore.getInstruments()
      )
    ]);

    this.skip = this.take - TradeQuantity.Take;
    this.take = TradeQuantity.Take;
    const executedOrderIds: string[] = uniq(
      args[0].map((t: any) => ({
        id: t.OrderId,
        volume: t.Volume
      }))
    );

    this.wampTrades += args[0].length;
    this.rootStore.orderStore.executeOrder(executedOrderIds);
  };

  onPublicTrades = (args: any[]) => {
    this.addPublicTrades(args.map(map.fromWampToPublicTrade));
  };

  @action
  reset = () => {
    this.trades = [];
    this.publicTrades = [];
  };

  private getSkipValue(skip: string, take: string, wamp: string) {
    this[skip] =
      (!this[skip] ? this[skip] + this[take] : this[skip] + this.loading) +
      this[wamp];
    this[wamp] = 0;
    return this[skip];
  }
}

export default TradeStore;
