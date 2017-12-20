import {computed, observable, runInAction} from 'mobx';
import {OrderBookApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class OrderBookStore extends BaseStore {
  @computed
  get allOrders() {
    return this.orders;
  }

  @observable private orders: any[] = [];

  constructor(store: RootStore, private readonly api: OrderBookApi) {
    super(store);
  }

  createOrders = ({ask, bid, id, price, timestamp}: any) => ({
    ask,
    bid,
    id,
    price,
    timestamp: timestamp.toLocaleTimeString()
  });

  fetchAll = async () => {
    const resp = await this.api.fetchAll();
    runInAction(() => {
      this.orders = resp.map(this.createOrders);
    });
  };

  reset = () => {
    this.orders = [];
  };
}

export default OrderBookStore;
