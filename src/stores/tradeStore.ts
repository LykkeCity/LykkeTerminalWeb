import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy, uniq} from 'rambda';
import {WampApi} from '../api';
import {TradeApi} from '../api/index';
import {TradeModel} from '../models/index';
import * as mappers from '../models/mappers';
import TradeQuantity from '../models/tradeLoadingQuantity';
import {BaseStore, RootStore} from './index';

class TradeStore extends BaseStore {
  @computed
  get allTrades() {
    const sort = compose<TradeModel[], TradeModel[], TradeModel[]>(
      reverse,
      sortBy((o: TradeModel) => new Date(o.timestamp).getTime())
    );
    return sort(this.trades);
  }

  @observable private trades: TradeModel[] = [];
  private skip: number = TradeQuantity.Skip;
  private take: number = TradeQuantity.Take;
  private loading: number = TradeQuantity.Loading;
  private wampTrades: number = 0;

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action
  addTrade = (trade: TradeModel[]) => (this.trades = this.trades.concat(trade));

  fetchAll = () => {
    return this.api.fetchAll(this.skip, this.take).then((dto: any) => {
      runInAction(() => {
        this.trades = dto.map(mappers.mapToTradeFromWamp);
      });
      return Promise.resolve();
    }, Promise.reject);
  };

  subscribe = () => {
    WampApi.subscribe(`trades`, this.onTrades);
  };

  fetchPart = async () => {
    this.skip = this.getSkipValue();
    const tradesDto = await this.api.fetchAll(this.skip, this.loading);
    const mappedTrades = tradesDto.map(mappers.mapToTradeFromWamp);
    this.addTrade(mappedTrades);
  };

  onTrades = (args: any) => {
    const mappedTrades = args[0].map(mappers.mapToTrade);
    const executedOrderIds: string[] = uniq(
      args[0].map((trade: any) => trade.OrderId)
    );

    this.wampTrades += mappedTrades.length;

    this.addTrade(mappedTrades);
    this.rootStore.orderStore.executeOrder(executedOrderIds);
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
