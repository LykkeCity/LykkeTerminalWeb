import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy} from 'rambda';
import {WampApi} from '../api';
import {TradeApi} from '../api/index';
import keys from '../constants/storageKeys';
import {TradeModel} from '../models/index';
import * as mappers from '../models/mappers';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const notificationStorage = StorageUtils(keys.notificationId);

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

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  @action addTrade = (trade: TradeModel) => this.trades.push(trade);

  fetchAll = async () => {
    const tradesDto = await this.api.fetchAll();
    runInAction(() => {
      this.trades = tradesDto.map(mappers.mapToTrade);
    });
  };

  subscribe = () => {
    WampApi.subscribe(`trades.${notificationStorage.get()}`, this.onTrades);
  };

  onTrades = (args: any) => {
    if (
      this.trades.some((item: TradeModel) => item.tradeId === args[0].TradeId)
    ) {
      return;
    }
    const trade = mappers.mapToTrade(args[0]);
    this.addTrade(trade);
  };

  @action
  reset = () => {
    this.trades = [];
  };
}

export default TradeStore;
