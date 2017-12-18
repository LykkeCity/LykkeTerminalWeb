import {computed, observable, runInAction} from 'mobx';
import {TradeListApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class TradeListStore extends BaseStore {
  @computed
  get allTradeLists() {
    return this.tradeLists;
  }

  @observable private tradeLists: any[] = [];

  constructor(store: RootStore, private readonly api: TradeListApi) {
    super(store);
  }

  createTradelist = ({id, price, side, symbol, timestamp, quantity}: any) => ({
    id,
    price,
    quantity,
    side,
    symbol,
    timestamp: timestamp.toLocaleTimeString()
  });

  fetchAll = async () => {
    const tradeListDto = await this.api.fetchAll();
    runInAction(() => {
      this.tradeLists = tradeListDto.map(this.createTradelist);
    });
  };

  reset = () => {
    this.tradeLists = [];
  };
}

export default TradeListStore;
