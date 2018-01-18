import {computed, observable, runInAction} from 'mobx';
import {WampApi} from '../api';
import {TradeApi} from '../api/index';
import keys from '../constants/storageKeys';
import {TradeModel} from '../models';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const notificationStorage = StorageUtils(keys.notificationId);

class TradeStore extends BaseStore {
  @computed
  get allTrades() {
    return this.trades;
  }

  @observable private trades: any[] = [];

  constructor(store: RootStore, private readonly api: TradeApi) {
    super(store);
  }

  createTradeList = ({
    Asset,
    OppositeAsset,
    Volume,
    Direction,
    Price,
    DateTime,
    TradeId
  }: any) => {
    return new TradeModel({
      price: Price,
      quantity: Volume,
      side: Direction,
      symbol: `${Asset}${OppositeAsset}`,
      timestamp: DateTime.toISOString(),
      tradeId: TradeId
    });
  };

  fetchAll = async () => {
    const tradesDto = await this.api.fetchAll();
    runInAction(() => {
      this.trades = tradesDto.map(this.createTradeList);
    });
  };

  subscribe = () => {
    WampApi.subscribe(`trades.${notificationStorage.get()}`, this.onTrades);
  };

  onTrades = (trades: any) => {
    this.trades = [...this.trades, ...trades[0].map(this.createTradeList)];
  };

  reset = () => {
    this.trades = [];
  };
}

export default TradeStore;
