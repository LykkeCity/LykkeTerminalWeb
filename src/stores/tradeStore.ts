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

  @observable.shallow private trades: TradeModel[] = [];
  @observable.shallow private publicTrades: TradeModel[] = [];
  private skip: number = TradeQuantity.Skip;
  private publicSkip: number = TradeQuantity.Skip;
  private take: number = TradeQuantity.Take;
  private publicTake: number = TradeQuantity.Take;
  private loading: number = TradeQuantity.Loading;
  private wampTrades: number = 0;
  private wampPublicTrades: number = 0;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action
  addTrades = (trades: TradeModel[]) =>
    (this.trades = this.trades.concat(trades));

  @action
  addPublicTrades = (trades: TradeModel[]) => {
    this.publicTrades = this.publicTrades.concat(trades);
  };

  fetchAll = () => {
    return this.api
      .fetchUserTrades(this.skip, this.take)
      .then((dto: any) => {
        runInAction(() => {
          this.trades = dto.map(mappers.mapToTradeFromRest);
        });
        return Promise.resolve();
      }, Promise.reject)
      .then(() => {
        return this.api
          .fetchPublicTrades(this.publicSkip, this.publicTake)
          .then((dto: any) => {
            this.publicTrades = dto.map(mappers.mapToTradeFromRest);
          });
      });
  };

  subscribe = (session: any) => {
    session.subscribe(topics.trade, this.onTrades);
  };

  subscribeToPublicTrades = (session: any) => {
    session.subscribe(
      topics.publicTrade(this.rootStore.uiStore.selectedInstrument!.id),
      this.onPublicTrades
    );
  };

  fetchPartTrade = async () => {
    this.skip = this.getSkipValue('skip', 'take', 'wampTrades');
    const tradesDto = await this.api.fetchUserTrades(this.skip, this.loading);
    this.addTrades(tradesDto.map(mappers.mapToTradeFromRest));
  };

  fetchPartPublicTrade = async () => {
    this.publicSkip = this.getSkipValue(
      'publicSkip',
      'publicTake',
      'wampPublicTrades'
    );
    const tradesDto = await this.api.fetchPublicTrades(
      this.publicSkip,
      this.loading
    );
    this.addPublicTrades(tradesDto.map(mappers.mapToTradeFromRest));
  };

  onTrades = (args: any[]) => {
    const mappedTrades = args[0].map(mappers.mapToTradeFromWamp);
    const executedOrderIds: string[] = uniq(
      args[0].map((trade: any) => ({
        id: trade.OrderId,
        volume: trade.Volume
      }))
    );

    this.wampTrades += mappedTrades.length;

    this.addTrades(mappedTrades);
    this.rootStore.orderStore.executeOrder(executedOrderIds);
  };

  onPublicTrades = (args: any[]) => {
    this.wampPublicTrades += args[0].length;
    this.addPublicTrades(args[0].map(mappers.mapToTradeFromWamp));
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
