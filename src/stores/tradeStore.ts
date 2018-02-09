import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy, uniq} from 'rambda';
import {TradeApi} from '../api/index';
import * as topics from '../api/topics';
import {Side, TradeModel} from '../models/index';
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
    return this.api.fetchUserTrades(this.skip, this.take).then((dto: any) => {
      runInAction(() => {
        this.trades = mappers.mapToTradeList(
          dto,
          this.rootStore.referenceStore.getInstrumentById
        );
      });
      return Promise.resolve();
    });
  };

  fetchPublicTrades = () => {
    this.api
      .fetchPublicTrades(this.publicSkip, this.publicTake)
      .then((dto: any) => {
        runInAction(() => {
          this.publicTrades = mappers.mapToTradeList(
            dto,
            this.rootStore.referenceStore.getInstrumentById
          );
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
    this.addTrades(
      mappers.mapToTradeList(
        tradesDto,
        this.rootStore.referenceStore.getInstrumentById
      )
    );
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
    this.addPublicTrades(
      mappers.mapToTradeList(
        tradesDto,
        this.rootStore.referenceStore.getInstrumentById
      )
    );
  };

  onTrades = (args: any[]) => {
    const side =
      this.rootStore.orderStore.lastOrder.OrderAction === 'buy' ? 0 : 1;
    const e = args[0].find((x: any) => x.Direction === side);
    const trade = new TradeModel({
      id: e.TradeId,
      symbol: e.Asset.concat('/', e.OppositeAsset),
      // tslint:disable-next-line:object-literal-sort-keys
      quantity: e.Volume,
      price: e.Price,
      timestamp: e.DateTime,
      tradeId: e.TradeId,
      side: e.Direction === 0 ? Side.Buy : Side.Sell
    });
    this.rootStore.orderStore.lastOrder = null;

    const mappedTrades = [trade];

    const executedOrderIds: string[] = uniq(
      args[0].map((t: any) => ({
        id: t.OrderId,
        volume: t.Volume
      }))
    );

    this.wampTrades += mappedTrades.length;

    this.addTrades(mappedTrades);
    this.rootStore.orderStore.executeOrder(executedOrderIds);
  };

  onPublicTrades = (args: any[]) => {
    this.wampPublicTrades += args[0].lengths;
    this.addPublicTrades(
      mappers.mapToTradeList(
        args[0],
        this.rootStore.referenceStore.getInstrumentById
      )
    );
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
