import {computed, observable, runInAction} from 'mobx';
import {OrderListApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class OrderListStore extends BaseStore {
  @computed
  get allOrderLists() {
    return this.orders;
  }

  @observable private orders: any[] = [];

  constructor(store: RootStore, private readonly api: OrderListApi) {
    super(store);
  }

  createOrderList = ({
    createdDate,
    currentPrice,
    currentPriceSide,
    expiryDate,
    id,
    orderID,
    openPrice,
    side,
    symbol,
    volume
  }: any) => ({
    createdDate: createdDate.toLocaleTimeString(),
    currentPrice,
    currentPriceSide,
    expiryDate,
    id,
    orderID,
    openPrice,
    side,
    symbol,
    volume
  });

  fetchAll = async () => {
    const orderListDto = await this.api.fetchAll();
    runInAction(() => {
      this.orders = orderListDto.map(this.createOrderList);
    });
  };

  reset = () => {
    this.orders = [];
  };
}

export default OrderListStore;
