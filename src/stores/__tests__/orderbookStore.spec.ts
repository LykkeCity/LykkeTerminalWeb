import {add, range, times} from 'rambda';
import {AssetModel, InstrumentModel, Side} from '../../models';
import {Order} from '../../models/index';
import {workerMock} from '../../workers/worker';
import {OrderBookStore, RootStore} from '../index';
import {
  aggregateOrders,
  connectLimitOrders,
  getMultiplier,
  getNextIdx,
  getPrevIdx,
  getSortedByPriceLevel,
  groupOrdersByPrice,
  mapToOrder
} from '../orderBookHelpers';

describe('orderBook store', () => {
  const rootStore = new RootStore(true);

  const orderBookStore = rootStore.orderBookStore;
  orderBookStore.fetchAll = jest.fn();
  orderBookStore.reset = jest.fn();
  orderBookStore.subscribe = jest.fn();

  const tradeStore = rootStore.tradeStore;
  tradeStore.fetchPublicTrades = tradeStore.subscribeToPublicTrades = tradeStore.unsubscribeFromPublicTrades = tradeStore.resetTrades = tradeStore.fetchTrades = jest.fn();
  rootStore.priceStore.fetchLastPrice = rootStore.priceStore.fetchDailyCandle = rootStore.priceStore.subscribeToDailyCandle = rootStore.priceStore.unsubscribeFromDailyCandle = jest.fn();
  rootStore.uiStore.selectedInstrument = new InstrumentModel({
    baseAsset: new AssetModel({name: 'BTC'}),
    id: 'BTCUSD',
    quoteAsset: new AssetModel({name: 'USD'})
  });

  const store = new OrderBookStore(rootStore, {} as any, workerMock);
  const {getBestBid, getBestAsk, mid} = store;

  test('order should contain users volume with equal price', () => {
    const limitOrders = [
      {
        id: '0',
        price: 1,
        remainingVolume: 0.0001,
        side: Side.Buy
      },
      {
        id: '1',
        price: 1,
        remainingVolume: 0.0001,
        side: Side.Buy
      }
    ];
    const ownVolume = limitOrders.map(x => x.remainingVolume).reduce(add, 0);

    const orders = [
      {price: 1, volume: 1},
      {price: 2, volume: 2},
      {price: 3, volume: 3}
    ] as Order[];

    const aggOrders = aggregateOrders(orders, 1, false);
    const connOrders = connectLimitOrders(aggOrders, limitOrders, 1, false);
    expect(connOrders[0].price).toBe(1);
    expect(connOrders[0].connectedLimitOrders).toHaveLength(2);
    expect(connOrders[0].orderVolume).toBe(ownVolume);
  });

  test('best bid should have highest price', async () => {
    store.rawBids = [
      {price: 10, volume: 1},
      {price: 20, volume: 2},
      {price: 30, volume: 3}
    ] as Order[];

    const bid = await store.getBestBid();
    expect(bid).toBe(30);
  });

  test('best ask should have lowest price', async () => {
    store.rawAsks = [
      {price: 10, volume: 1},
      {price: 20, volume: 2},
      {price: 30, volume: 3}
    ] as Order[];

    const ask = await getBestAsk();
    expect(ask).toBe(10);
  });

  test('mid should be as an average between bestBid and bestAsk', async () => {
    store.rawAsks = [
      {price: 40, volume: 1},
      {price: 50, volume: 2},
      {price: 60, volume: 3}
    ] as Order[];

    store.rawBids = [
      {price: 10, volume: 1},
      {price: 20, volume: 2},
      {price: 30, volume: 3}
    ] as Order[];

    const midPrice = await mid();
    expect(midPrice).toBe((40 + 30) / 2);
  });

  test('best bid should be less that best ask', async () => {
    const bid = await getBestBid();
    const ask = await getBestAsk();
    expect(bid).toBeLessThan(ask);
  });

  describe('group by price', () => {
    it('should group levels by price', () => {
      // bids
      const orders = [
        {price: 1000, volume: 1},
        {price: 1000, volume: 1},
        {price: 1000, volume: 1},
        {price: 2000, volume: 2},
        {price: 2000, volume: 2},
        {price: 3000, volume: 3},
        {price: 10000, volume: 10}
      ] as Order[];
      const newOrders = groupOrdersByPrice(orders);

      expect(newOrders).toHaveLength(4);
      expect(newOrders[0]).toEqual({price: 1000, volume: 3, depth: 3});
      expect(newOrders[1]).toEqual({price: 2000, volume: 4, depth: 7});
      expect(newOrders[2]).toEqual({price: 3000, volume: 3, depth: 10});
      expect(newOrders[3]).toEqual({price: 10000, volume: 10, depth: 20});
    });

    it('should return empty array if no data provided', () => {
      expect(groupOrdersByPrice([])).toHaveLength(0);
    });

    it('should handle single-element arrays', () => {
      const orders = [{price: 1000, volume: 1, depth: 1}] as Order[];

      const newOrders = groupOrdersByPrice(orders);

      expect(newOrders).toHaveLength(1);
      expect(newOrders[0]).toEqual(orders[0]);
    });

    it('should sort levels by price and return it by index', () => {
      const levels = [
        {price: 10, volume: 1},
        {price: 20, volume: 2},
        {price: 30, volume: 3}
      ] as Order[];
      expect(getSortedByPriceLevel(levels, 0)).toBe(levels[0]);
    });
  });

  describe('depth', () => {
    it('should calculate depth as a sum of prev volumes', () => {
      const orders = times(i => ({price: i, volume: i}), 10) as Order[];

      const newOrders = groupOrdersByPrice(orders);

      expect(newOrders[0].depth).toBe(0);
      expect(newOrders[4].depth).toBe(range(1, 5).reduce(add, 0));
      expect(newOrders[orders.length - 1].depth).toBe(
        range(1, 10).reduce(add, 0)
      );
    });
  });

  describe('aggregation', () => {
    it('should aggregate orders by price', () => {
      const orders = [
        {price: 10, volume: 1},
        {price: 20, volume: 2},
        {price: 30, volume: 3},
        {price: 100, volume: 10}
      ] as Order[];

      const newOrders = aggregateOrders(orders, 15, true);

      expect(newOrders).toHaveLength(3);
      expect(newOrders[0].price).toBe(15);
      expect(newOrders[0].volume).toBe(1);
      expect(newOrders[1].price).toBe(30);
      expect(newOrders[1].volume).toBe(5);
      expect(newOrders[2].price).toBe(105);
      expect(newOrders[2].volume).toBe(10);
    });

    it('should return original orders if span is too low', () => {
      const orders = [
        {price: 10, volume: 1, depth: 1},
        {price: 11, volume: 2, depth: 3},
        {price: 12, volume: 3, depth: 6},
        {price: 13, volume: 10, depth: 16}
      ] as Order[];

      const newOrders = aggregateOrders(orders, 1, true);

      expect(orders).toEqual(newOrders);
    });

    it('should correctly set price range of spans', () => {
      const asks = [];
      for (let i = 0; i < 10; i++) {
        asks.push({price: i < 5 ? i + 10 : i + 20} as Order);
      }

      const spannedAsks = aggregateOrders(asks, 10, true);
      expect(spannedAsks).toHaveLength(3);
      expect(spannedAsks[0].price).toBe(10);
      expect(spannedAsks[2].price).toBe(30);
    });

    it('should return original orders if span eq to 0', () => {
      const asks = [];
      for (let i = 0; i < 5; i++) {
        asks.push({price: i} as Order);
      }

      const spannedAsks = aggregateOrders(asks, 0, true);
      expect(spannedAsks).toHaveLength(asks.length);
      expect(spannedAsks[0].price).toBe(asks[0].price);
      expect(spannedAsks[spannedAsks.length - 1].price).toBe(
        asks[asks.length - 1].price
      );
    });

    describe('span multiplier', () => {
      // 1,2,3,4,5,6,7,8,9,10
      const list = times(i => i + 1, 10);

      it('should inc multiplier index', () => {
        expect(getNextIdx(0, list)).toBe(1);
        expect(getNextIdx(5, list)).toBe(6);
        expect(getNextIdx(10, list)).toBe(10);
      });

      it('should dec multiplier index', () => {
        expect(getPrevIdx(0, list)).toBe(0);
        expect(getPrevIdx(5, list)).toBe(4);
        expect(getPrevIdx(10, list)).toBe(9);
      });

      it('should get correct multiplier', () => {
        expect(getMultiplier(0, list)).toBe(1);
        expect(getMultiplier(1, list)).toBe(1 * 2);
        expect(getMultiplier(5, list)).toBe(1 * 2 * 3 * 4 * 5 * 6);
      });
    });

    describe('mapping', () => {
      const levels = [
        {
          Id: '3b9af4bb-7985-443b-9716-dbb23024248d',
          Price: 4198.99,
          Volume: 0.00238153,
          DateTime: new Date()
        }
      ];

      const mappedLevel = mapToOrder(levels, Side.Buy)[0];

      it('should map to order level model', () => {
        expect(mappedLevel.id).toBe(levels[0].Id);
        expect(mappedLevel.price).toBe(levels[0].Price);
        expect(mappedLevel.volume).toBe(levels[0].Volume);
        expect(mappedLevel.timestamp).toBe(levels[0].DateTime);
        expect(mappedLevel.depth).toBe(0);
        expect(mappedLevel.orderVolume).toBe(0);
        expect(mappedLevel.connectedLimitOrders.length).toBe(0);
        expect(Array.isArray(mappedLevel.connectedLimitOrders)).toBe(true);
      });
    });
  });
});
