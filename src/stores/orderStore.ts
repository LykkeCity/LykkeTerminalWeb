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
  private updatePriceByOrderBook: any;

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
    this.notificationStore = this.rootStore.notificationStore;
    this.modalStore = this.rootStore.modalStore;
  }

  updatePriceFn = (fn: any) => {
    this.updatePriceByOrderBook = fn;
  };

  updatePrice = (price: number, quantity: number) => {
    if (this.updatePriceByOrderBook) {
      this.updatePriceByOrderBook(price, quantity);
    }
  };

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

  editOrder = async (body: any, id: string) => {
    return this.api.placeLimit(body).then((orderId: string) => {
      return this.api
        .cancelOrder(id)
        .then(this.orderEditedSuccessfully)
        .catch(() => this.api.cancelOrder(orderId))
        .then(this.updateOrders);
    }, this.orderPlacedUnsuccessfully);
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

  executeOrder = (orders: any[]) => {
    this.rootStore.orderListStore.fetchAll().then(() => {
      orders.forEach(order =>
        this.rootStore.orderListStore.limitOrders.forEach(limit => {
          const match = limit.id === order.id;

          if (match) {
            if (limit.volume === order.volume) {
              this.notificationStore.addNotification(
                levels.success,
                messages.orderExecuted(order.id)
              );
            } else {
              this.notificationStore.addNotification(
                levels.success,
                messages.orderExecutedPartially(order.id, order.volume)
              );
            }
          }
        })
      );

      this.updateOrders();
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

    const needConfirmation =
      error.status === 400 &&
      error.message &&
      JSON.parse(error.message).Confirmation;

    if (needConfirmation) {
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

    return Promise.reject(error);
  };

  private orderEditedSuccessfully = () => {
    this.notificationStore.addNotification(
      levels.success,
      messages.editOrderSuccess
    );
  };
}

export default OrderStore;
