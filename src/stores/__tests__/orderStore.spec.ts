import {OrderApi} from '../../api';
import logger from '../../Logger';
import {levels} from '../../models';
import {OrderStore, RootStore} from '../index';

describe('order store', () => {
  let orderStore: OrderStore;
  let rootStore: RootStore;
  let api: OrderApi;

  beforeEach(() => {
    rootStore = new RootStore(true);
    api = new OrderApi(rootStore);
    rootStore.orderListStore.deleteOrder = jest.fn();

    orderStore = new OrderStore(rootStore, api);

    api.cancelOrder = jest.fn();

    rootStore.notificationStore.addNotification = jest.fn();
    rootStore.modalStore.addModal = jest.fn();
  });

  describe('method cancelOrder', () => {
    const orderId = '1';

    it('should call for api method to cancel order', async () => {
      await orderStore.cancelOrder(orderId);
      expect(api.cancelOrder).toHaveBeenCalledWith(orderId);
    });

    it('should remove order from order list store', async () => {
      await orderStore.cancelOrder(orderId);
      expect(rootStore.orderListStore.deleteOrder).toHaveBeenCalledWith(
        orderId
      );
    });

    it('should not add notification if no order found in order list', async () => {
      rootStore.orderListStore.deleteOrder = jest.fn().mockReturnValue(null);

      await orderStore.cancelOrder(orderId);
      expect(
        rootStore.notificationStore.addNotification
      ).not.toHaveBeenCalled();
    });

    it('should add notification if order canceled correctly', async () => {
      rootStore.orderListStore.deleteOrder = jest.fn().mockReturnValue({});

      await orderStore.cancelOrder(orderId);
      expect(rootStore.notificationStore.addNotification).toHaveBeenCalled();
    });

    it('should log exception in logger', async () => {
      logger.logException = jest.fn();
      api.cancelOrder = jest.fn().mockImplementation(() => {
        throw new Error('Ooops, something went wrong');
      });

      await orderStore.cancelOrder(orderId);
      expect(logger.logException).toHaveBeenCalled();
    });

    it('should show notification with error message on expection', async () => {
      const errorMessage = 'Ooops, something went wrong';
      api.cancelOrder = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await orderStore.cancelOrder(orderId);
      expect(rootStore.notificationStore.addNotification).toHaveBeenCalledWith(
        levels.error,
        errorMessage
      );
    });

    it('should show modal window if session confirmation is required', async () => {
      const errorMessage = 'Session confirmation is required';
      api.cancelOrder = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await orderStore.cancelOrder(orderId);
      expect(rootStore.modalStore.addModal).toHaveBeenCalled();
    });
  });
});
