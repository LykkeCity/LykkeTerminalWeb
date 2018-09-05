import {ISubscription} from 'autobahn';
import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy} from 'rambda';
import {TradeApi} from '../api/index';
import * as topics from '../api/topics';
import {AnalyticsEvents} from '../constants/analyticsEvents';
import {keys} from '../models';
import {TradeFilter, TradeModel} from '../models/index';
import TradeQuantity from '../models/tradeLoadingQuantity';
import * as map from '../models/tradeModel.mapper';
import {AnalyticsService} from '../services/analyticsService';
import {nextSkip} from '../utils';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const MAX_TRADE_COUNT = 999;
const tradesStorage = StorageUtils(keys.trades);
const publicTradesStorage = StorageUtils(keys.publicTrades);

const sortByDate = compose<TradeModel[], TradeModel[], TradeModel[]>(
  reverse,
  sortBy((o: TradeModel) => new Date(o.timestamp).getTime())
);

const sortMultiField = (source: TradeModel[]) => {
  return source.sort(
    (a: any, b: any) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() ||
      b.index - a.index
  );
};

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
    return sortMultiField(this.publicTrades);
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
  private isWampTradesProcessed: boolean = false;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action
  addTrade = (trade: TradeModel) => {
    if (this.isTradeVisible(trade)) {
      this.trades.push(trade);
    }
  };

  @action
  addTrades = (trades: TradeModel[]) => {
    this.trades = this.trades.concat(
      trades.filter(trade => this.isTradeVisible(trade))
    );
    tradesStorage.set(JSON.stringify(this.trades));
  };

  @action
  addPublicTrades = (trades: TradeModel[]) => {
    const updatedTrades = this.publicTrades.concat(
      trades.map(trade => ({...trade, instrument: this.selectedInstrument!}))
    );

    this.publicTrades = this.filterTrades(updatedTrades);
    publicTradesStorage.set(JSON.stringify(this.publicTrades));
  };

  @action
  setFilter = (filter: TradeFilter) => {
    this.filter = filter;
    this.resetTrades();
    this.fetchTrades();
  };

  getIsWampTradesProcessed = () => this.isWampTradesProcessed;
  setIsWampTradesProcessed = (isProcessing: boolean) =>
    (this.isWampTradesProcessed = isProcessing);

  fetchTrades = async () => {
    if (this.selectedInstrument) {
      this.hasPendingItems = true;

      try {
        const trades = await this.api.fetchTrades(
          this.getWalletId(),
          this.instrumentIdByFilter,
          this.skip,
          TradeQuantity.Take
        );
        this.hasPendingItems = false;
        runInAction(() => {
          this.addTrades(
            map.aggregateTradesByTimestamp([...trades], this.instruments)
          );
          this.shouldFetchMore = trades.length >= TradeQuantity.Take;
        });
      } catch {
        if (this.rootStore.apiStore.getUseCacheData()) {
          this.trades = JSON.parse(tradesStorage.get()!);
        }
      }
    }
  };

  fetchNextTrades = async () => {
    this.skip = nextSkip(this.skip, TradeQuantity.Take, this.receivedFromWamp);
    this.fetchTrades();
    AnalyticsService.track(AnalyticsEvents.LoadMoreTrades);
  };

  fetchPublicTrades = async () => {
    if (this.selectedInstrument) {
      try {
        const resp = await this.api.fetchPublicTrades(
          this.selectedInstrument.id,
          TradeQuantity.Skip,
          TradeQuantity.Take
        );
        runInAction(() => {
          this.addPublicTrades(resp.map(map.fromRestToPublicTrade));
        });
      } catch {
        if (this.rootStore.apiStore.getUseCacheData()) {
          this.publicTrades = JSON.parse(publicTradesStorage.get()!);
        }
      }
    }
  };

  refetchTrades = () => {
    this.trades = [];
    this.fetchTrades();
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
    this.setIsWampTradesProcessed(true);
    this.addPublicTrades(args.map(map.fromWampToPublicTrade));
  };

  unsubscribeFromPublicTrades = async () => {
    const subscriptions = Array.from(this.subscriptions).map(s => {
      // tslint:disable-next-line:no-unused-expression
      this.getWs() && this.getWs().unsubscribe(s);
    });
    await Promise.all(subscriptions);
    if (this.subscriptions.size > 0) {
      this.subscriptions.clear();
    }
  };

  @action
  resetTrades = () => {
    this.trades = [];
    this.skip = 0;
    this.receivedFromWamp = 0;
    this.shouldFetchMore = false;
  };

  @action
  resetPublicTrades = () => {
    this.publicTrades = [];
    this.unsubscribeFromPublicTrades();
  };

  @action
  reset = () => {
    this.resetTrades();
    this.resetPublicTrades();
    this.setIsWampTradesProcessed(false);
  };

  private getWalletId = () => this.rootStore.balanceListStore.tradingWallet!.id;

  private isTradeVisible(trade: TradeModel) {
    if (!this.isTradeFromTradingWallet(trade)) {
      return false;
    }

    return (
      this.filter === TradeFilter.All ||
      this.isTradeAvailableForCurrentInstrument(trade)
    );
  }

  private isTradeFromTradingWallet(trade: TradeModel) {
    return !trade.walletId || trade.walletId === this.getWalletId();
  }

  private isTradeAvailableForCurrentInstrument(trade: TradeModel) {
    return trade.instrument!.id === this.instrumentIdByFilter;
  }

  private filterTrades = (trades: TradeModel[]) => {
    if (trades.length > MAX_TRADE_COUNT) {
      const numberOfOldTrades = trades.length - MAX_TRADE_COUNT;
      for (let index = 0; index < numberOfOldTrades; index++) {
        trades.shift();
      }
    }

    return trades;
  };
}

export default TradeStore;
