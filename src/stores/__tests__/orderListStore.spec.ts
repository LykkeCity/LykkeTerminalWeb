import {OrderModel} from '../../models';
import {OrderListStore, RootStore} from '../index';

describe('orderList store', () => {
  let orderListStore: OrderListStore;
  const api: any = {
    fetchAll: jest.fn(),
    placeLimit: jest.fn(),
    placeMarket: jest.fn()
  };

  const defaultOrder = {
    AssetPairId: 'BTCUSD',
    CreateDateTime: '2018-01-17T07:17:40.84Z',
    Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c7',
    OrderAction: 'Buy',
    Price: 1,
    Status: 'InOrderBook',
    Volume: 0.0001,
    RemainingVolume: 0
  };

  beforeEach(() => {
    const rootStore = new RootStore(true);
    rootStore.orderBookStore.fetchAll = jest.fn();
    orderListStore = new OrderListStore(rootStore, api);

    api.fetchAll = jest.fn(() => [defaultOrder]);
  });

  describe('order', () => {
    beforeEach(async done => {
      await orderListStore.fetchAll();
      done();
    });

    it('should be added into order list and return added order', () => {
      expect(orderListStore.allOrders.length).toBe(1);
      const order = {
        AssetPairId: 'BTCUSD',
        CreateDateTime: '2018-01-17T07:17:40.84Z',
        Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c6',
        OrderAction: 'Sell',
        Price: 1,
        Status: 'InOrderBook',
        Volume: 0.0001
      };
      const addedOrder = orderListStore.addOrder(order);
      expect(orderListStore.allOrders.length).toBe(2);
      expect(addedOrder!.id).toBe(order.Id);
    });

    it('should not be added into order list with the same id and return тгдд', () => {
      expect(orderListStore.allOrders.length).toBe(1);
      const addedOrder = orderListStore.addOrder(defaultOrder);
      expect(orderListStore.allOrders.length).toBe(1);
      expect(addedOrder).toBeNull();
    });

    it('should be deleted from order list and return deletedOrder', () => {
      expect(orderListStore.allOrders.length).toBe(1);
      const deletedOrder = orderListStore.deleteOrder(defaultOrder.Id);
      expect(orderListStore.allOrders.length).toBe(0);
      expect(deletedOrder!.id).toBe(defaultOrder.Id);
    });

    it('should return null if deleted order does not exist in the order list', () => {
      const deletedOrder = orderListStore.deleteOrder('some id');
      expect(deletedOrder).toBeNull();
    });

    it('should be updated', () => {
      const dto = {
        Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c7',
        RemainingVolume: 0.00005
      };
      expect(orderListStore.allOrders[0].remainingVolume).not.toBe(
        dto.RemainingVolume
      );
      orderListStore.addOrUpdateOrder(dto);
      expect(orderListStore.allOrders[0].remainingVolume).toEqual(
        dto.RemainingVolume
      );
    });
  });

  describe('state', () => {
    it('orderLists should be defined after instantiation', () => {
      expect(orderListStore.limitOrders).toBeDefined();
      expect(orderListStore.limitOrders).not.toBeNull();
    });

    it('orderLists should be an empty array by default', () => {
      expect(orderListStore.limitOrders instanceof Array).toBeTruthy();
      expect(orderListStore.limitOrders.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear orderLists', async () => {
      orderListStore.reset();

      expect(orderListStore.limitOrders.length).toBe(0);
    });
  });

  describe('order item', () => {
    it('should correctly map from dto', async () => {
      await orderListStore.fetchAll();
      const order = orderListStore.allOrders[0];

      expect(orderListStore.allOrders).toHaveLength(1);
      expect(order.createdAt).toBeDefined();
      expect(order.price).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.side).toBeDefined();
      expect(order.symbol).toBeDefined();
      expect(order.volume).toBeDefined();
    });

    it('should be an instance of OrderModel', async () => {
      await orderListStore.fetchAll();
      const order = orderListStore.allOrders[0];
      expect(order instanceof OrderModel).toBeTruthy();
    });
  });
});
