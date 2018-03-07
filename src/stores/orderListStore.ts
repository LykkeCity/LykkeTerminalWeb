import {action, computed, observable} from 'mobx';
import {compose, reverse, sortBy} from 'rambda';
import {OrderApi} from '../api/index';
import {OrderModel} from '../models';
import * as mappers from '../models/mappers';
import OrdersDefaultSelection from '../models/ordersDefaultSelection';
import {BaseStore, RootStore} from './index';

class OrderListStore extends BaseStore {
  @computed
  get limitOrders() {
    const update = compose<
      OrderModel[],
      OrderModel[],
      OrderModel[],
      OrderModel[]
    >(
      reverse,
      sortBy((o: OrderModel) => o.createdAt.getTime()),
      this.filterOrders
    );
    return update(this.orders);
  }

  @computed
  get isOrderLength() {
    return this.orders.length;
  }

  @computed
  get selectedOrderOptions() {
    return this.selectedOrder;
  }

  @observable private orders: OrderModel[] = [];
  @observable
  private selectedOrder: string = OrdersDefaultSelection.CurrentAsset;

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

  filterOrders = (orders: OrderModel[]) => {
    return this.selectedOrderOptions === OrdersDefaultSelection.All
      ? orders
      : orders.filter(
          order =>
            this.rootStore.uiStore.selectedInstrument &&
            order.symbol === this.rootStore.uiStore.selectedInstrument!.id
        );
  };

  toggleOrders = (option: string) => {
    this.selectedOrder = option;
    this.rootStore.uiStore.toggleOrdersSelect();
  };

  reset = () => {
    this.orders = [];
    this.selectedOrder = OrdersDefaultSelection.All;
  };
}

export default OrderListStore;
