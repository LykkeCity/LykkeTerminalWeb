import {OrderModel} from '../../models';
import {OrderListStore, RootStore} from '../index';

describe('orderList store', () => {
  let orderListStore: OrderListStore;
  const api: any = {
    fetchAll: jest.fn(),
    placeMarket: jest.fn(),
    placePending: jest.fn()
  };

  beforeEach(() => {
    orderListStore = new OrderListStore(new RootStore(false), api);

    api.fetchAll = jest.fn(() => [
      {
        Asset: 'BTC',
        AssetPair: 'BTCUSD',
        DateTime: new Date(),
        Id: 1549153684,
        OrderType: 'Buy',
        Price: 1246498,
        TotalCost: 0,
        Volume: 2
      }
    ]);
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

  describe('update orderLists', () => {
    it('should update orderLists', async () => {
      expect(orderListStore.allOrderLists.length).toBe(0);
      orderListStore.updateOrders([
        {
          AssetPair: 'BTCUSD',
          DateTime: new Date(),
          Id: 12389418351364984,
          OrderType: 'Buy',
          Price: 5900.65,
          Volume: 1
        }
      ]);
      expect(orderListStore.allOrderLists.length).toBe(1);
    });
  });

  describe('order item', () => {
    it('should contain the following fields', async () => {
      await orderListStore.fetchAll();
      const order = orderListStore.allOrderLists[0];
      expect(order.createdDate).toBeDefined();
      expect(order.currentPrice).toBeDefined();
      expect(order.expiryDate).toBeDefined();
      expect(order.orderId).toBeDefined();
      expect(order.side).toBeDefined();
      expect(order.symbol).toBeDefined();
      expect(order.volume).toBeDefined();
    });

    it('should be an instance of OrderModel', async () => {
      await orderListStore.fetchAll();
      const order = orderListStore.allOrderLists[0];
      expect(order instanceof OrderModel).toBeTruthy();
    });
  });
});
