import {computed, observable, runInAction} from 'mobx';
import {WampApi} from '../api';
import {TradeListApi} from '../api/index';
import keys from '../constants/storageKeys';
import TradeListModel from '../models/tradeModel';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const notificationStorage = StorageUtils(keys.notificationId);

class TradeListStore extends BaseStore {
  @computed
  get allTradeLists() {
    return this.tradeLists;
  }

  @observable private tradeLists: any[] = [];

  constructor(store: RootStore, private readonly api: TradeListApi) {
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
    return new TradeListModel({
      price: Price,
      quantity: Volume,
      side: Direction,
      symbol: `${Asset}${OppositeAsset}`,
      timestamp: DateTime.toISOString(),
      tradeId: TradeId
    });
  };

  fetchAll = async () => {
    const tradeListDto = await this.api.fetchAll();
    runInAction(() => {
      this.tradeLists = tradeListDto.map(this.createTradeList);
    });
  };

  subscribe = () => {
    WampApi.subscribe(`trades.${notificationStorage.get()}`, this.onTrades);
  };

  onTrades = (trades: any) => {
    this.tradeLists = [
      ...this.tradeLists,
      ...trades[0].map(this.createTradeList)
    ];
  };

  reset = () => {
    this.tradeLists = [];
  };
}

export default TradeListStore;
