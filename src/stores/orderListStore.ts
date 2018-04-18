import {action, computed, observable} from 'mobx';
import {compose, reverse, sortBy} from 'rambda';
import {OrderApi} from '../api/index';
import {InstrumentModel, OrderModel} from '../models';
import * as mappers from '../models/mappers';
import OrdersDefaultSelection from '../models/ordersDefaultSelection';
import {BaseStore, RootStore} from './index';

class OrderListStore extends BaseStore {
  @computed
  get allOrders() {
    return this.orders;
  }

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
  get hasOrders() {
    return this.limitOrders.length > 0;
  }

  @computed
  get selectedOrderOptions() {
    return this.selectedOrder;
  }

  @observable hasPendingRequests: boolean = false;
  @observable.shallow private orders: OrderModel[] = [];
  @observable
  private selectedOrder: string = OrdersDefaultSelection.CurrentAsset;

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
  }

  @computed
  get limitOrdersForThePair() {
    const {uiStore: {selectedInstrument}} = this.rootStore;
    return this.limitOrders.filter(
      order => order.symbol === (selectedInstrument && selectedInstrument.id)
    );
  }

  fetchAll = async () => {
    this.hasPendingRequests = true;
    const dto = await this.api.fetchAll();
    this.orders = dto.map(mappers.mapToLimitOrder);
    this.hasPendingRequests = false;
  };

  @action
  addOrder = (order: any) => {
    this.orders.push(mappers.mapToLimitOrder(order));
  };

  @action
  deleteOrder = (orderId: string) =>
    (this.orders = [
      ...this.orders.filter((order: OrderModel) => order.id !== orderId)
    ]);

  @action
  addOrUpdateOrder = (dto: any) => {
    const order = this.orders.find((o: OrderModel) => o.id === dto.Id);
    if (!order) {
      this.addOrder(dto);
      return;
    }
    order!.remainingVolume = dto.RemainingVolume;
    order!.volume = dto.Volume;
  };

  filterOrders = (orders: OrderModel[], instrument?: InstrumentModel) => {
    const {selectedInstrument} = this.rootStore.uiStore;
    if (selectedInstrument || instrument) {
      return this.selectedOrderOptions === OrdersDefaultSelection.CurrentAsset
        ? orders.filter(order => order.symbol === selectedInstrument!.id)
        : orders;
    }
    return [];
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
