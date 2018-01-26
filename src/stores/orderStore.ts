import OrderApi from '../api/orderApi';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import {OrderModel} from '../models';
import OrderType from '../models/orderType';
import {BaseStore, RootStore} from './index';
import NotificationStore from './notificationStore';

// tslint:disable:no-console

class OrderStore extends BaseStore {
  private readonly notificationStore: NotificationStore;

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
    this.notificationStore = this.rootStore.notificationStore;
  }

  placeOrder = async (orderType: string, body: any) => {
    switch (orderType) {
      case OrderType.Market:
        return this.api
          .placeMarket(body)
          .then(this.orderPlacedSuccessfully, this.orderPlacedUnsuccessfully)
          .then(() => Promise.resolve());
      case OrderType.Limit:
        return this.api
          .placeLimit(body)
          .then(this.orderPlacedSuccessfully, this.orderPlacedUnsuccessfully)
          .then(() => Promise.resolve());
    }
  };

  cancelOrder = async (id: string) => {
    await this.api.cancelOrder(id);
    this.notificationStore.addNotification(
      levels.information,
      `${messages.orderCanceled} ${id}`
    );
    this.updateOrders();
  };

  cancelAll = async () => {
    const orders = this.rootStore.orderListStore.limitOrders;
    const promises = orders.map((order: OrderModel) => {
      return this.api.cancelOrder(order.id);
    });
    await Promise.all(promises).then(() =>
      this.notificationStore.addNotification(
        levels.information,
        messages.allOrdersCanceled
      )
    );
    this.updateOrders();
  };

  reset = () => {
    return;
  };

  private updateOrders = () => {
    this.rootStore.balanceListStore.fetchAll();
    this.rootStore.orderListStore.fetchAll();
  };

  private orderPlacedSuccessfully = () => {
    this.updateOrders();
    this.notificationStore.addNotification(
      levels.success,
      messages.orderSuccess
    );
  };

  private orderPlacedUnsuccessfully = (error: any) => {
    console.error(error);
    const {message} = JSON.parse(error.message);
    this.notificationStore.addNotification(
      levels.error,
      `${messages.orderError} ${message}`
    );
  };
}

export default OrderStore;
