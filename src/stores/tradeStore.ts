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
  private take: number = TradeQuantity.Take;
  private loading: number = TradeQuantity.Loading;
  private wampTrades: number = 0;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action
  addTrade = (trade: TradeModel[]) => (this.trades = this.trades.concat(trade));

  @action
  addPublicTrade = (trade: TradeModel) => {
    this.publicTrades.push(trade);
  };

  fetchAll = () => {
    return this.api.fetchAll(this.skip, this.take).then((dto: any) => {
      runInAction(() => {
        this.trades = dto.map(mappers.mapToTradeFromRest);
      });
      return Promise.resolve();
    }, Promise.reject);
  };

  subscribe = (session: any) => {
    session.subscribe(topics.trade, this.onTrades);
    session.subscribe(
      topics.publicTrade(this.rootStore.uiStore.selectedInstrument!.id),
      this.onPublicTrades
    );
  };

  fetchPart = async () => {
    this.skip = this.getSkipValue();
    const tradesDto = await this.api.fetchAll(this.skip, this.loading);
    const mappedTrades = tradesDto.map(mappers.mapToTradeFromRest);
    this.addTrade(mappedTrades);
  };

  onTrades = (args: any[]) => {
    const mappedTrades = args[0].map(mappers.mapToTradeFromWamp);
    const executedOrderIds: string[] = uniq(
      args[0].map((trade: any) => trade.OrderId)
    );

    this.wampTrades += mappedTrades.length;

    this.addTrade(mappedTrades);
    this.rootStore.orderStore.executeOrder(executedOrderIds);
  };

  onPublicTrades = (args: any[]) => {
    this.addPublicTrade(args[0].map(mappers.mapToTradeFromWamp));
  };

  @action
  reset = () => {
    this.trades = [];
  };

  private getSkipValue() {
    this.skip += this.wampTrades;
    this.wampTrades = 0;
    return !this.skip ? this.skip + this.take : this.skip + this.loading;
  }
}

export default TradeStore;
