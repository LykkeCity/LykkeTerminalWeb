import OrderApi from '../api/orderApi';
import OrderType from '../models/orderType';
import {BaseStore, RootStore} from './index';

class OrderStore extends BaseStore {
  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
  }

  placeOrder = async (orderType: string, body: any) => {
    switch (orderType) {
      case OrderType.Market:
        this.api
          .placeMarket(body)
          .then(() => alert('success'))
          .catch((err: any) => alert(err));
        break;
      case OrderType.Pending:
        this.api
          .placePending(body)
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
