import OrderApi from '../api/orderApi';
import {OrderModel} from '../models';
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
        return this.api
          .placeMarket(body)
          .then(
            (resp: any) => {
              this.rootStore.balanceListStore.fetchAll();
              this.rootStore.orderListStore.fetchAll();
              alert('Order was placed succesfully');
            },
            (error: any) => {
              console.error(error);
              alert(`There is an error placing your order: ${error}`);
            }
          )
          .then(() => Promise.resolve());
      case OrderType.Limit:
        return this.api
          .placeLimit(body)
          .then(
            (resp: any) => {
              this.rootStore.balanceListStore.fetchAll();
              this.rootStore.orderListStore.fetchAll();
              alert('Order was placed succesfully');
            },
            (error: any) => {
              console.error(error);
              alert(`There is an error placing your order: ${error}`);
            }
          )
          .then(() => Promise.resolve());
    }
  };

  cancelOrder = async (id: string) => {
    await this.api.cancelOrder(id);
    alert(`Order ${id} has cancelled`);
    this.updateOrders();
  };

  cancelAll = async () => {
    const orders = this.rootStore.orderListStore.limitOrders;
    const promises = orders.map((order: OrderModel) => {
      return this.api.cancelOrder(order.id);
    });
    await Promise.all(promises).then(() => alert(`All orders have cancelled`));
    this.updateOrders();
  };

  reset = () => {
    return;
  };

  private updateOrders = () => {
    this.rootStore.orderListStore.fetchAll();
  };
}

export default OrderStore;
