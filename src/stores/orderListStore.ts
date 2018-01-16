import {computed, observable, runInAction} from 'mobx';
import {OrderApi} from '../api/index';
import {MockOrderApi} from '../api/orderApi';
import OrderListModel from '../models/orderModel';
import {BaseStore, RootStore} from './index';

class OrderListStore extends BaseStore {
  @computed
  get allOrderLists() {
    return this.orders;
  }

  @observable private orders: any[] = [];

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
  }

  createOrderList = ({
    Id,
    DateTime,
    OrderType,
    Volume,
    Price,
    AssetPair
  }: any) => {
    return new OrderListModel({
      createdDate: DateTime.toISOString(),
      currentPrice: Price,
      expiryDate: '',
      orderId: Id,
      side: OrderType,
      symbol: AssetPair,
      volume: Volume
    });
  };

  fetchAll = async () => {
    const orderListDto = await this.api.fetchAll();
    runInAction(() => {
      this.orders = orderListDto.map(this.createOrderList);
    });
  };

  updateOrders = (orders: any) => {
    this.orders = [...this.orders, ...orders.map(this.createOrderList)];
  };

  reset = () => {
    this.orders = [];
  };
}

export default OrderListStore;
