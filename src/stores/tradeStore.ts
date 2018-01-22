import {action, computed, observable, runInAction} from 'mobx';
import {compose, reverse, sortBy, without} from 'rambda';
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
    let trade: any;
    let order: any;
    args[0].forEach((item: any) => {
      order = this.rootStore.orderStore.orders.find((o: any) =>
        this.findOrder(o, item)
      );
      if (order) {
        this.rootStore.orderStore.orders = without(
          [order],
          this.rootStore.orderStore.orders
        );
        trade = item;
      }
    });

    if (!trade) {
      return;
    }

    const mappedTrade = mappers.mapToTrade(trade);
    this.addTrade(mappedTrade);
  };

  @action
  reset = () => {
    this.trades = [];
  };

  private findOrder = (order: any, item: any) => {
    if (
      order.AssetId === item.Asset &&
      order.AssetPairId === `${item.Asset}${item.OppositeAsset}` &&
      order.Volume === item.Volume
    ) {
      return order.Price ? order.Price === item.Price : true;
    }
    return false;
  };
}

export default TradeStore;
