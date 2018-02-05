import OrderApi from '../api/orderApi';
import ModalMessages from '../constants/modalMessages';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import {OrderModel} from '../models';
import Types from '../models/modals';
import OrderType from '../models/orderType';
import {BaseStore, RootStore} from './index';
import ModalStore from './modalStore';
import NotificationStore from './notificationStore';

// tslint:disable:no-console

class OrderStore extends BaseStore {
  private readonly modalStore: ModalStore;
  private readonly notificationStore: NotificationStore;

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
    this.notificationStore = this.rootStore.notificationStore;
    this.modalStore = this.rootStore.modalStore;
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

  executeOrder = (orderIds: string[]) => {
    this.rootStore.orderListStore.fetchAll().then(() => {
      const orders = orderIds.filter(
        order =>
          !!this.rootStore.orderListStore.limitOrders.find(
            limit => limit.id === order
          )
      );

      setTimeout(() => {
        this.updateOrders();
        orders.forEach(order =>
          this.notificationStore.addNotification(
            levels.success,
            messages.orderExecuted(order)
          )
        );
      }, 1000);
    });
  };

  reset = () => {
    return;
  };

  private updateOrders = () => {
    this.rootStore.orderListStore.fetchAll();
    // this.rootStore.balanceListStore.fetchAll();
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

    if (error.status === 400) {
      this.modalStore.addModal(
        ModalMessages.expired,
        null,
        null,
        Types.Expired
      );
      return;
    }

    let message;
    try {
      message = JSON.parse(error.message).message;
    } catch (e) {
      message = !!error.message.length ? error.message : messages.defaultError;
    }
    this.notificationStore.addNotification(
      levels.error,
      `${messages.orderError} ${message}`
    );
  };
}

export default OrderStore;
