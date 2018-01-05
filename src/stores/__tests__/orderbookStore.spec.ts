import {RestOrderBookApi} from '../../api/orderBookApi';
import {AssetModel, InstrumentModel} from '../../models';
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

  describe('place mid price in order book', () => {
    const rootStore = new RootStore(false);
    const {placeInMiddle, calcMidPrice} = new OrderBookStore(
      rootStore,
      null as any
    );
    const orders: any = [{bid: 1}, {bid: 2}, {ask: 3}, {ask: 4}];

    it('should add one more element to an array', () => {
      expect(placeInMiddle(orders).length).toBe(orders.length + 1);
    });

    it('should place mid price in the middle of orders', () => {
      const midPrice = {val: 2.5};
      const newOrders = placeInMiddle(orders, midPrice);
      expect(newOrders[orders.length / 2]).toBe(midPrice);
      expect(newOrders[2]).not.toBe({ask: 3});
      expect(newOrders[2]).not.toBe({bid: 2});
    });

    it('should work correctly with assymetric arrays', () => {
      const prevOrders: any = [{bid: 1}, {ask: 3}, {ask: 4}, {ask: 5}];
      const midPrice = {val: 2};
      const nextOrders = placeInMiddle(prevOrders, midPrice);
      expect(nextOrders[3]).toBe(midPrice);
      expect(nextOrders[1]).not.toBe({bid: 1});
      expect(nextOrders[1]).not.toBe({ask: 3});
    });

    it('should calc mid price as an avg of the neighbours', () => {
      const objs = [
        {price: 1, isBuy: true} as OrderBookModel,
        {price: 11, isBuy: false} as OrderBookModel
      ];
      expect(calcMidPrice(objs)).toBe(6);
    });
  });

  describe('max ask and max bid values', () => {
    const rootStore = new RootStore(true);
    const store = new OrderBookStore(rootStore, null as any);
    store.fetchAll = jest.fn(() => orderBookStore.addOrder(newOrder));
    rootStore.uiStore.selectedInstrument = new InstrumentModel({
      accuracy: 3,
      baseAsset: expect.any(AssetModel),
      id: 'BTCCHF',
      invertedAccuracy: 8,
      name: 'BTC/CHF',
      quotingAsset: expect.any(AssetModel)
    });

    const maxValue = 16000;
    const minValue = 15000;

    const orders: any = [
      {
        IsBuy: false,
        Levels: [
          {
            Price: maxValue
          },
          {
            Price: minValue
          }
        ]
      },
      {
        IsBuy: true,
        Levels: [
          {
            Price: maxValue
          },
          {
            Price: minValue
          }
        ]
      }
    ];

    it('should be returned', () => {
      store.sortOrders(orders);
      expect(store.maxAskValue).toBe(maxValue);
      expect(store.maxBidValue).toBe(maxValue);
    });
  });
});
