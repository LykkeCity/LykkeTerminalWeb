import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy, uniq} from 'rambda';
import {TradeApi} from '../api/index';
import * as topics from '../api/topics';
import {TradeModel} from '../models/index';
import * as mappers from '../models/mappers';
import TradeQuantity from '../models/tradeLoadingQuantity';
import {BaseStore, RootStore} from './index';

const sortByDate = compose<TradeModel[], TradeModel[], TradeModel[]>(
  reverse,
  sortBy((o: TradeModel) => new Date(o.timestamp).getTime())
);

class TradeStore extends BaseStore {
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

  @observable.shallow private trades: TradeModel[] = [];
  @observable.shallow private publicTrades: TradeModel[] = [];
  private skip: number = TradeQuantity.Skip;
  private take: number = TradeQuantity.Take;
  private loading: number = TradeQuantity.Loading;
  private wampTrades: number = 0;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

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
      this.addTrades(
        mappers.mapToTradeList(
          resp,
          this.selectedInstrument!.quoteAsset.accuracy
        )
      );
    });
  };

  fetchPublicTrades = async () => {
    const {uiStore: {selectedInstrument}} = this.rootStore;
    if (selectedInstrument && selectedInstrument.id) {
      const resp = await this.api.fetchPublicTrades(
        selectedInstrument.id,
        TradeQuantity.Skip,
        TradeQuantity.Take
      );
      runInAction(() => {
        this.publicTrades = resp.map(mappers.mapRestDtoToPublicTrade);
      });
    }
  };

  subscribe = (ws: any) => {
    ws.subscribe(topics.trade, this.onTrades);
  };

  subscribeToPublicTrades = (ws: any) => {
    const instrumentId = this.rootStore.uiStore.selectedInstrument!.id;
    ws.subscribe(topics.publicTrade(instrumentId), this.onPublicTrades);
  };

  fetchPartTrade = async () => {
    this.skip = this.getSkipValue('skip', 'take', 'wampTrades');
    this.fetchTrades();
  };

  onTrades = async (args: any[]) => {
    this.take += this.skip;
    this.skip = TradeQuantity.Skip;
    await this.fetchTrades();
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
    this.addPublicTrades(args.map(mappers.mapWampDtoToPublicTrade));
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
