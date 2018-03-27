import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy, uniq} from 'rambda';
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
  get needToLoadMore() {
    return this.trades.length > 0;
  }

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  private subscriptions: Set<ISubscription> = new Set();

  private skip: number = TradeQuantity.Skip;
  private take: number = TradeQuantity.Take;
  private skipWamp: number = 0;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action
  setFilter = (filter: TradeFilter) => {
    this.trades = [];
    this.skip = 0;
    this.filter = filter;
    this.fetchTrades();
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
    if (this.selectedInstrument) {
      const instrument =
        this.filter === TradeFilter.CurrentAsset
          ? this.selectedInstrument
          : undefined;
      const resp = await this.api.fetchTrades(instrument, this.skip, this.take);
      runInAction(() => {
        this.addTrades(
          map.fromRestToTradeList(
            resp,
            this.rootStore.referenceStore.getInstruments()
          )
        );
      });
    }
  };

  fetchPartTrade = async () => {
    this.skip = nextSkip(this.skip, this.take, this.skipWamp);
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
    ws.subscribe(topics.trade, this.onTrades);
  };

  onTrades = async (args: any[]) => {
    const mappedTrades = map.fromWampToTrade(
      args[0],
      this.rootStore.referenceStore.getInstruments()
    );

    this.skipWamp += 2;

    this.addTrades([mappedTrades]);

    const executedOrderIds: string[] = uniq(
      args[0].map((t: any) => ({
        id: t.OrderId,
        volume: t.Volume
      }))
    );

    this.rootStore.orderStore.executeOrder(executedOrderIds);
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

  onPublicTrades = (args: any[]) => {
    this.addPublicTrades(args.map(map.fromWampToPublicTrade));
  };

  @action
  reset = () => {
    this.trades = [];
    this.publicTrades = [];
  };
}

export default TradeStore;
