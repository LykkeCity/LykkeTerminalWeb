import {MockOrderListApi} from '../../api/orderListApi';
import {OrderListStore, RootStore} from '../index';

describe('orderList store', () => {
  let orderListStore: OrderListStore;

  beforeEach(() => {
    orderListStore = new OrderListStore(
      new RootStore(false),
      new MockOrderListApi()
    );
  });

  describe('state', () => {
    it('orderLists should be defined after instantiation', () => {
      expect(orderListStore.allOrderLists).toBeDefined();
      expect(orderListStore.allOrderLists).not.toBeNull();
    });

    it('orderLists should be an empty array by default', () => {
      expect(orderListStore.allOrderLists instanceof Array).toBeTruthy();
      expect(orderListStore.allOrderLists.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear orderLists', async () => {
      await orderListStore.fetchAll();
      expect(orderListStore.allOrderLists.length).toBeGreaterThan(0);

      orderListStore.reset();

      expect(orderListStore.allOrderLists.length).toBe(0);
    });
  });

  describe('fetch orderLists', () => {
    it('should populate orderList collection', async () => {
      await orderListStore.fetchAll();
      expect(orderListStore.allOrderLists.length).toBeGreaterThan(0);
    });
  });

  describe('order item', () => {
    it('should contain the following fields', async () => {
      await orderListStore.fetchAll();
      const order = orderListStore.allOrderLists[0];
      expect(order.createdDate).toBeDefined();
      expect(order.currentPrice).toBeDefined();
      expect(order.currentPriceSide).toBeDefined();
      expect(order.expiryDate).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.orderId).toBeDefined();
      expect(order.openPrice).toBeDefined();
      expect(order.side).toBeDefined();
      expect(order.symbol).toBeDefined();
      expect(order.volume).toBeDefined();
    });
  });
});
