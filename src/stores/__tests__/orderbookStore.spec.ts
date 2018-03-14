import {times} from 'rambda';
import {AssetModel, InstrumentModel} from '../../models';
import {Order} from '../../models/index';
import * as mappers from '../../models/mappers';
import {OrderBookStore, RootStore} from '../index';
import {
  getMultiplier,
  getNextMultiplierIdx,
  getPrevMultiplierIdx
} from '../orderBookStore';

describe('orderBook store', () => {
  const rootStore = new RootStore(true);
  rootStore.orderBookStore.fetchAll = jest.fn();
  rootStore.orderBookStore.reset = jest.fn();
  rootStore.orderBookStore.subscribe = jest.fn();
  rootStore.uiStore.selectedInstrument = new InstrumentModel({
    baseAsset: new AssetModel({name: 'BTC'}),
    id: 'BTCUSD',
    quoteAsset: new AssetModel({name: 'USD'})
  });

  const orders = [
    {
      AssetPairId: 'BTCUSD',
      CreateDateTime: '2018-01-17T07:17:40.84Z',
      Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c7',
      OrderAction: 'Buy',
      Price: 1,
      Status: 'InOrderBook',
      Voume: 0.0001
    },
    {
      AssetPairId: 'BTCUSD',
      CreateDateTime: '2018-01-17T07:17:40.84Z',
      Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c5',
      OrderAction: 'Buy',
      Price: 1,
      Status: 'InOrderBook',
      Voume: 0.0001
    }
  ];
  const limitOrders = orders.map(mappers.mapToLimitOrder);
  rootStore.orderListStore.updateOrders(limitOrders);

  const store = new OrderBookStore(rootStore, {} as any);
  const {onUpdate, bestBid, bestAsk, mid, bestBids, bestAsks} = store;

  beforeEach(() => {
    // bids
    onUpdate([
      {
        IsBuy: true,
        Levels: [
          {Price: 1, Volume: 1},
          {Price: 2, Volume: 1},
          {Price: 3, Volume: 3}
        ]
      }
    ]);
    // asks
    onUpdate([
      {
        IsBuy: false,
        Levels: [
          {Price: 5, Volume: 1},
          {Price: 6, Volume: 2},
          {Price: 7, Volume: 3}
        ]
      }
    ]);
  });

  test('order should contain users volume with equal price', () => {
    const order = store.rawBids.find(bid => bid.price === limitOrders[0].price);
    const ownVolume = limitOrders.reduce((sum, limitOrder) => {
      sum += limitOrder.volume;
      return sum;
    }, 0);
    expect(order!.orderVolume).toBe(ownVolume);
  });

  test('best bid should have highest price', () => {
    expect(bestBid()).toBe(3);
  });

  test('best ask should have lowest price', () => {
    expect(bestAsk()).toBe(5);
  });

  test('mid should be as an average between bestBid and bestAsk', () => {
    expect(mid()).toBe(4);
  });

  test('best bids should return N best bids', () => {
    const bids = bestBids(2);
    expect(bids).toHaveLength(2);
    expect(bids.map(x => x.price)).toEqual([3, 2]);
    expect(bids.map(x => x.price)[0]).toEqual(bestBid());
  });

  test('best asks should return N best asks', () => {
    const asks = bestAsks(2);
    expect(asks).toHaveLength(2);
    expect(asks.map(x => x.price)).toEqual([6, 5]);
    expect(asks.map(x => x.price)[asks.length - 1]).toEqual(bestAsk());
  });

  test('best asks should be sorted by price descending', () => {
    const asks = bestAsks(2).map(o => o.price);
    expect(asks[0]).toBeGreaterThan(asks[asks.length - 1]);
  });

  test('best bids should be sorted by price descending', () => {
    const bids = bestBids(2).map(o => o.price);
    expect(bids[0]).toBeGreaterThan(bids[bids.length - 1]);
  });

  test('best bid should be less that best bid', () => {
    expect(bestBid()).toBeLessThan(bestAsk());
  });

  describe('group by price', () => {
    it('should group levels by price', () => {
      // bids
      onUpdate([
        {
          IsBuy: true,
          Levels: [
            {Price: 1, Volume: 1},
            {Price: 1, Volume: 2},
            {Price: 2, Volume: 1},
            {Price: 3, Volume: 3},
            {Price: 3, Volume: 5}
          ]
        }
      ]);
      // asks
      onUpdate([
        {
          IsBuy: false,
          Levels: [
            {Price: 5, Volume: 1},
            {Price: 5, Volume: 10},
            {Price: 6, Volume: 2},
            {Price: 6, Volume: 22},
            {Price: 7, Volume: 3}
          ]
        }
      ]);

      expect(store.rawBids.find(b => b.price === 1)!.volume).toBe(1 + 2);
      expect(store.rawBids.find(b => b.price === 3)!.volume).toBe(3 + 5);
      expect(store.rawAsks.find(b => b.price === 5)!.volume).toBe(1 + 10);
      expect(store.rawAsks.find(b => b.price === 6)!.volume).toBe(2 + 22);
    });

    it('should return empty array if no data provided', () => {
      // bids
      onUpdate([
        {
          IsBuy: true,
          Levels: []
        }
      ]);
      // asks
      onUpdate([
        {
          IsBuy: false,
          Levels: []
        }
      ]);

      expect(store.rawBids).toHaveLength(0);
      expect(store.rawAsks).toHaveLength(0);
    });

    it('should not mutate unique prices', () => {
      const k = 5;
      const generateLevels = (num: number) => {
        const levels = [];
        for (let i = 1; i < num; i++) {
          levels.push({Price: i, Volume: i});
        }
        return levels;
      };
      // bids
      onUpdate([
        {
          IsBuy: true,
          Levels: generateLevels(k)
        }
      ]);
      // asks
      onUpdate([
        {
          IsBuy: false,
          Levels: generateLevels(k)
        }
      ]);

      for (let i = 1; i < k; i++) {
        expect(store.rawBids.find(b => b.price === i)!.volume).toBe(i);
      }
      for (let i = 1; i < k; i++) {
        expect(store.rawAsks.find(b => b.price === i)!.volume).toBe(i);
      }
    });
  });

  describe('depth', () => {
    const seed = (count: number = 10) => {
      const nextOrders = [];
      for (let idx = 1; idx <= count; idx++) {
        nextOrders.push({price: idx, volume: idx * count, depth: 0});
      }
      return nextOrders;
    };
    it('should calculate depth as a sum of prev volumes', () => {
      store.rawAsks = store.rawBids = [];
      store.rawBids = seed(10) as Order[];
      store.rawAsks = seed(10) as Order[];

      expect(store.addDepth(store.rawBids)[0].depth).toBe(10);
      expect(store.addDepth(store.rawAsks)[9].depth).toBe(550);
    });
  });

  describe('aggregation', () => {
    it('should be defined', expect(store.aggregateBy).toBeDefined);

    it('should aggregate orders by price', () => {
      const span = 2000;
      const bids = [];
      const asks = [];
      for (let i = 1; i < 11; i++) {
        bids.push({price: i * 1000} as Order);
      }

      for (let i = 1; i < 11; i++) {
        asks.push({price: i < 5 ? i * 1000 : i * 2000} as Order);
      }

      const spannedBids = store.aggregateBy(span, bids);
      expect(spannedBids).toHaveLength(5);

      const spannedAsks = store.aggregateBy(span, asks);
      expect(spannedAsks).toHaveLength(8);

      expect(store.aggregateBy(0, [])).toHaveLength(0);
    });

    it('should correctly set price range of spans', () => {
      const asks = [];
      for (let i = 0; i < 10; i++) {
        asks.push({price: i < 5 ? i + 10 : i + 20} as Order);
      }

      const spannedAsks = store.aggregateBy(10, asks);
      expect(spannedAsks).toHaveLength(2);
      expect(spannedAsks[0].price).toBe(asks[0].price);
      expect(spannedAsks[1].price).toBe(asks[0].price + 10);
    });

    it('should return original orders if span eq to 0', () => {
      const asks = [];
      for (let i = 0; i < 5; i++) {
        asks.push({price: i} as Order);
      }

      const spannedAsks = store.aggregateBy(0, asks);
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
        expect(getNextMultiplierIdx(0, list)).toBe(1);
        expect(getNextMultiplierIdx(5, list)).toBe(6);
        expect(getNextMultiplierIdx(10, list)).toBe(10);
      });

      it('should dec multiplier index', () => {
        expect(getPrevMultiplierIdx(0, list)).toBe(0);
        expect(getPrevMultiplierIdx(5, list)).toBe(4);
        expect(getPrevMultiplierIdx(10, list)).toBe(9);
      });

      it('should get correct multiplier', () => {
        expect(getMultiplier(1, list)).toBe(1);
        expect(getMultiplier(2, list)).toBe(1 * 2);
        expect(getMultiplier(6, list)).toBe(1 * 2 * 3 * 4 * 5 * 6);
      });
    });
  });
});
