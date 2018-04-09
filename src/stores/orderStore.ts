import OrderApi from '../api/orderApi';
import * as topics from '../api/topics';
import ModalMessages from '../constants/modalMessages';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import {OrderModel, OrderType} from '../models';
import Types from '../models/modals';
import {OrderBookType} from '../models/orderType';
import {BaseStore, RootStore} from './index';
import ModalStore from './modalStore';
import NotificationStore from './notificationStore';

// tslint:disable:no-console

class OrderStore extends BaseStore {
  private readonly modalStore: ModalStore;
  private readonly notificationStore: NotificationStore;
  private updatePriceByOrderBook: any;
  private updateDepthByOrderBook: any;

  constructor(store: RootStore, private readonly api: OrderApi) {
    super(store);
    this.notificationStore = this.rootStore.notificationStore;
    this.modalStore = this.rootStore.modalStore;
  }

  updatePriceFn = (fn: any) => {
    this.updatePriceByOrderBook = fn;
  };

  updateDepthFn = (fn: any) => {
    this.updateDepthByOrderBook = fn;
  };

  updatePrice = (price: number) => {
    if (this.updatePriceByOrderBook) {
      this.updatePriceByOrderBook(price);
    }
  };

  updateDepth = (quantity: number) => {
    if (this.updateDepthByOrderBook) {
      this.updateDepthByOrderBook(quantity);
    }
  };

  updatePriceAndDepth = (price: number, quantity: number) => {
    this.updatePrice(price);
    this.updateDepth(quantity);
  };

  placeOrder = async (orderType: string, body: any) => {
    switch (orderType) {
      case OrderType.Market:
        return (
          this.api
            .placeMarket(body)
            // tslint:disable-next-line:no-empty
            .then(() => {}, this.orderPlacedUnsuccessfully)
            .then(() => Promise.resolve())
        );
      case OrderType.Limit:
        return (
          this.api
            .placeLimit(body)
            // tslint:disable-next-line:no-empty
            .then(() => {}, this.orderPlacedUnsuccessfully)
            .then(() => Promise.resolve())
        );
    }
  };

  editOrder = async (body: any, id: string) =>
    this.api
      .cancelOrder(id)
      .then(() => this.api.placeLimit(body))
      .catch(this.orderPlacedUnsuccessfully);

  cancelOrder = async (id: string) => {
    await this.api.cancelOrder(id);
  };

  cancelAll = async () => {
    this.rootStore.orderListStore.limitOrders.forEach((order: OrderModel) => {
      this.api.cancelOrder(order.id);
    });
  };

  subscribe = (ws: any) => {
    ws.subscribe(topics.orders, this.onOrders);
  };

  onOrders = (args: any) => {
    const order = args[0][0];
    switch (order.Status) {
      case OrderBookType.Cancelled:
        this.rootStore.orderListStore.deleteOrder(order.Id);
        this.orderCancelledSuccessfully(order.Id);
        break;
      case OrderBookType.Matched:
        this.rootStore.orderListStore.deleteOrder(order.Id);
        this.orderClosedSuccessfully(order.Id);
        break;
      case OrderBookType.Processing:
        this.rootStore.orderListStore.updateOrder(order);
        this.orderPartiallyClosedSuccessfully(order.Id, order.RemainingVolume);
        break;
      case OrderBookType.Placed:
        this.rootStore.orderListStore.addOrder(order);
        this.orderPlacedSuccessfully();
        break;
    }
  };

  reset = () => {
    return;
  };

  private orderClosedSuccessfully = (orderId: string) => {
    this.notificationStore.addNotification(
      levels.success,
      messages.orderExecuted(orderId)
    );
  };

  private orderPartiallyClosedSuccessfully = (
    orderId: string,
    orderVolume: number
  ) => {
    this.notificationStore.addNotification(
      levels.success,
      messages.orderExecutedPartially(orderId, orderVolume)
    );
  };

  private orderPlacedSuccessfully = () => {
    this.notificationStore.addNotification(
      levels.success,
      messages.orderSuccess
    );
  };

  private orderCancelledSuccessfully = (orderId: string) => {
    this.notificationStore.addNotification(
      levels.information,
      `${messages.orderCancelled} ${orderId}`
    );
  };

  private orderPlacedUnsuccessfully = (error: any) => {
    const messageObject = JSON.parse(error.message);
    if (messageObject) {
      const key = Object.keys(messageObject)[0];

      if (error.status === 400) {
        switch (key) {
          case 'Confirmation': {
            this.modalStore.addModal(
              ModalMessages.expired,
              null,
              null,
              Types.Expired
            );
            return;
          }
          case 'AssetKycNeeded': {
            this.modalStore.addModal(null, null, null, Types.MissedKyc);
            return;
          }
          default:
            {
              const message = messageObject[key];
              this.notificationStore.addNotification(
                levels.error,
                `${message}`
              );
            }
            break;
        }
      }
    }
  };
}

export default OrderStore;
