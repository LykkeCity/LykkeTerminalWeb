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
        this.api.placeMarket(body).then(
          (resp: any) => {
            this.rootStore.balanceListStore.fetchAll();
            this.rootStore.orderListStore.fetchAll();
            alert('Order was placed succesfully');
          },
          (error: any) => {
            console.error(error);
            alert(`There is an error placing your order: ${error}`);
          }
        );
        break;
      case OrderType.Limit:
        this.api.placeLimit(body).then(
          (resp: any) => {
            this.rootStore.balanceListStore.fetchAll();
            this.rootStore.orderListStore.fetchAll();
            alert('Order was placed succesfully');
          },
          (error: any) => {
            console.error(error);
            alert(`There is an error placing your order: ${error}`);
          }
        );
        break;
    }
  };

  reset = () => {
    return;
  };
}

export default OrderStore;
