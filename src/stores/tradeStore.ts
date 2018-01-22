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

  @action
  addTrade = (trade: TradeModel[]) => (this.trades = this.trades.concat(trade));

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
    const mappedTrades = args[0].map(mappers.mapToTrade);
    this.addTrade(mappedTrades);
  };

  @action
  reset = () => {
    this.trades = [];
  };
}

export default TradeStore;
