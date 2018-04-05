import OrderApi from '../api/orderApi';
import ModalMessages from '../constants/modalMessages';
import levels from '../constants/notificationLevels';
import messages from '../constants/notificationMessages';
import {OrderModel, OrderType} from '../models';
import Types from '../models/modals';
import {OrderStatus} from '../models/orderType';
import {capitalize} from '../utils';
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
        return this.api
          .placeMarket(body)
          .then(this.orderPlacedSuccessfully, this.orderPlacedUnsuccessfully)
          .then(() => Promise.resolve());
      case OrderType.Limit:
        return (
          this.api
            .placeLimit(body)
            // tslint:disable-next-line:no-empty
            .then((orderId: any) => {
              const addedOrder = this.rootStore.orderListStore.addOrder({
                Id: orderId,
                CreateDateTime: new Date(),
                OrderAction: capitalize(body.OrderAction),
                Volume: body.Volume,
                RemainingVolume: body.Volume,
                Price: body.Price,
                AssetPairId: body.AssetPairId
              });
              if (addedOrder) {
                this.orderPlacedSuccessfully();
              }
            }, this.orderPlacedUnsuccessfully)
        );
    }
  };

  editOrder = async (body: any, id: string) =>
    this.api
      .cancelOrder(id)
      .then(() => this.api.placeLimit(body))
      .then(this.updateOrders)
      .then(this.orderEditedSuccessfully)
      .catch(this.orderPlacedUnsuccessfully);

  cancelOrder = async (id: string) => {
    await this.api.cancelOrder(id);
    const deletedOrder = this.rootStore.orderListStore.deleteOrder(id);
    if (deletedOrder) {
      this.orderCancelledSuccessfully(id);
    }
  };

  cancelAll = () =>
    this.rootStore.orderListStore.limitOrders
      .map((o: OrderModel) => o.id)
      .forEach(this.cancelOrder);

  subscribe = (ws: any) => {
    ws.subscribe(topics.orders, this.onOrders);
  };

  onOrders = (args: any) => {
    const order = args[0][0];
    switch (order.Status) {
      case OrderStatus.Cancelled:
        const deleteOrder = this.rootStore.orderListStore.deleteOrder(order.Id);
        if (deleteOrder) {
          this.orderCancelledSuccessfully(order.Id);
        }
        break;
      case OrderStatus.Matched:
        this.rootStore.orderListStore.deleteOrder(order.Id);
        this.orderClosedSuccessfully(order.Id);
        break;
      case OrderStatus.Processing:
        this.rootStore.orderListStore.addOrUpdateOrder(order);
        this.orderPartiallyClosedSuccessfully(order.Id, order.RemainingVolume);
        break;
      case OrderStatus.Placed:
        const isAdded = this.rootStore.orderListStore.addOrder(order);
        if (isAdded) {
          this.orderPlacedSuccessfully();
        }
        break;
    }
  };

  convertPartiallyBalance = async (
    balance: number,
    baseAssetName: string,
    quoteAssetName: string
  ) => {
    return await MarketService.convertAsset(
      {
        Amount: balance,
        AssetId: baseAssetName
      },
      quoteAssetName
    );
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
    const needConfirmation =
      error.status === 400 &&
      error.message &&
      JSON.parse(error.message).Confirmation;

    const kycIsMissing =
      error.status === 400 &&
      error.message &&
      JSON.parse(error.message).AssetKycNeeded;

    if (needConfirmation) {
      this.modalStore.addModal(
        ModalMessages.expired,
        null,
        null,
        Types.Expired
      );
      return;
    }

    if (kycIsMissing) {
      this.modalStore.addModal(null, null, null, Types.MissedKyc);
      return;
    }

    let message;
    try {
      message =
        JSON.parse(error.message).ME || JSON.parse(error.message).message;
      message = ErrorParser.getMessage(message);
    } catch (e) {
      message = !!error.message.length ? error.message : messages.defaultError;
      console.log(message);
      message = this.createReadableMessage(message);
    }
    this.notificationStore.addNotification(levels.error, `${message}`);
  };

  private orderEditedSuccessfully = () => {
    this.notificationStore.addNotification(
      levels.success,
      messages.editOrderSuccess
    );
  };

  private createReadableMessage = (message: string) => {
    const messageObject = JSON.parse(message);
    if (messageObject) {
      const key = Object.keys(messageObject)[0];
      message = messageObject[key];
    }
    return message;
  };
}

export default OrderStore;
