import {action, computed, observable} from 'mobx';
import {compose, reverse, sortBy} from 'rambda';
import {OrderApi} from '../api/index';
import {OrderModel} from '../models';
import * as mappers from '../models/mappers';
import {BaseStore, RootStore} from './index';

class OrderListStore extends BaseStore {
  @computed
  get limitOrders() {
    const sort = compose<OrderModel[], OrderModel[], OrderModel[]>(
      reverse,
      sortBy((o: OrderModel) => o.createdAt.getTime())
    );
    return sort(this.orders);
  }

  @computed
  get isOrderLength() {
    return this.orders.length;
  }

  @observable private orders: OrderModel[] = [];

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
  }

  fetchAll = async () => {
    const dto = await this.api.fetchAll();

    this.updateOrders(dto.map(mappers.mapToLimitOrder));
    this.rootStore.orderBookStore.fetchAll();
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
