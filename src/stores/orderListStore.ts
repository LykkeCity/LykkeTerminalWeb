import {action, computed, observable} from 'mobx';
import {OrderApi} from '../api/index';
import {OrderModel} from '../models';
import * as mappers from '../models/mappers';
import {BaseStore, RootStore} from './index';

class OrderListStore extends BaseStore {
  @computed
  get limitOrders() {
    return this.orders;
  }

  @observable private orders: OrderModel[] = [];

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
  }

  fetchAll = async () => {
    const dto = await this.api.fetchAll();

    this.updateOrders(dto.map(mappers.mapToLimitOrder));
  };

  @action
  updateOrders = (orders: OrderModel[]) => {
    this.orders = orders;
  };

  reset = () => {
    this.orders = [];
  };
}

export default OrderListStore;
