import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy, uniq} from 'rambda';
import {TradeApi} from '../api/index';
import * as topics from '../api/topics';
import {TradeModel} from '../models/index';
import * as mappers from '../models/mappers';
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
    return this.api.fetchAll().then((dto: any) => {
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

  onTrades = (args: any[]) => {
    const mappedTrades = args[0].map(mappers.mapToTradeFromWamp);
    const executedOrderIds: string[] = uniq(
      args[0].map((trade: any) => trade.OrderId)
    );

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
}

export default TradeStore;
