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
        this.api
          .orderByMarket(body)
          .then(() => alert('success'))
          .catch((err: any) => alert(err));
        break;
      case OrderType.Pending:
        this.api
          .orderByPending(body)
          .then(() => alert('success'))
          .catch((err: any) => alert(err));
        break;
    }
  };

  reset = () => {
    alert('reset');
  };
}

export default OrderStore;
