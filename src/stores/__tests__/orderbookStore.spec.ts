import {RestOrderBookApi} from '../../api/orderBookApi';
import {OrderBookModel} from '../../models/index';
import {OrderBookStore, RootStore} from '../index';

describe('orderBook store', () => {
  let orderBookStore: OrderBookStore;

  const newOrder = new OrderBookModel({
    ask: 100,
    bestBid: false,
    bid: 0,
    id: 7,
    price: 15010,
    timestamp: new Date()
  });

  beforeEach(() => {
    orderBookStore = new OrderBookStore(
      new RootStore(false),
      new RestOrderBookApi()
    );

    orderBookStore.fetchAll = jest.fn(() => orderBookStore.addOrder(newOrder));
  });

  describe('state', () => {
    it('orders should be defined after instantiation', () => {
      expect(orderBookStore.allOrders).toBeDefined();
      expect(orderBookStore.allOrders).not.toBeNull();
    });

    it('orders should be an empty array by default', () => {
      expect(orderBookStore.allOrders instanceof Array).toBeTruthy();
      expect(orderBookStore.allOrders.length).toBe(0);
    });
  });

  describe('fetch OrderBook', () => {
    it('should populate orders collection', () => {
      orderBookStore.fetchAll();
      expect(orderBookStore.allOrders.length).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('should clear orders', () => {
      orderBookStore.fetchAll();
      expect(orderBookStore.allOrders.length).toBeGreaterThan(0);

      orderBookStore.reset();
      expect(orderBookStore.allOrders.length).toBe(0);
    });
  });

  describe('order item', () => {
    it('should contain the following fields', async () => {
      await orderBookStore.fetchAll();
      expect(orderBookStore.allOrders[0].ask).toBeDefined();
      expect(orderBookStore.allOrders[0].bestBid).toBeDefined();
      expect(orderBookStore.allOrders[0].bid).toBeDefined();
      expect(orderBookStore.allOrders[0].id).toBeDefined();
      expect(orderBookStore.allOrders[0].price).toBeDefined();
      expect(orderBookStore.allOrders[0].timestamp).toBeDefined();
    });
  });
});
