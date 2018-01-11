import OrderApi from '../api/orderApi';
import OrderType from '../models/orderType';
import {BaseStore, RootStore} from './index';

class OrderStore extends BaseStore {
  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
  }

  executeOperation = async (platform: string, body: any) => {
    switch (platform) {
      case OrderType.Market:
        const resp = await this.api.orderByMarket(body);
        this.rootStore.orderListStore.updateOrders(resp);
        break;
      case OrderType.Pending:
        const resp2 = await this.api.orderByPending(body);
        this.rootStore.orderListStore.updateOrders(resp2);
        break;
    }
  };

  reset = () => {
    alert('reset');
  };
}

export default OrderStore;
