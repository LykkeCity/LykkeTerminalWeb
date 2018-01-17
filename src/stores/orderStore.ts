import OrderApi from '../api/orderApi';
import OrderType from '../models/orderType';
import {BaseStore, RootStore} from './index';

// tslint:disable:no-console

class OrderStore extends BaseStore {
  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
  }

  placeOrder = async (orderType: string, body: any) => {
    switch (orderType) {
      case OrderType.Market:
        this.api
          .placeMarket(body)
          .then(() => {
            this.rootStore.balanceListStore.fetchAll();
            console.log('Order was placed succesfully');
          })
          .catch((err: any) => {
            console.log('There is an error placing your order');
          });
        break;
      case OrderType.Pending:
        this.api
          .placePending(body)
          .then(() => {
            this.rootStore.balanceListStore.fetchAll();
            console.log('Order was placed succesfully');
          })
          .catch((err: any) => {
            console.log('There is an error placing your order');
          });
        break;
    }
  };

  reset = () => {
    return;
  };
}

export default OrderStore;
