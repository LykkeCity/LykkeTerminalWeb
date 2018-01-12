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
        await this.api.orderByMarket(body);
        break;
      case OrderType.Pending:
        await this.api.orderByPending(body);
        break;
    }
  };

  reset = () => {
    alert('reset');
  };
}

export default OrderStore;
