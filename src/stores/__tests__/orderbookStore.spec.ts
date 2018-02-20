import {OrderBookStore, RootStore} from '../index';

describe('orderBook store', () => {
  const store = new OrderBookStore(new RootStore(false), {} as any);
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

      expect(store.bids.find(b => b.price === 1)!.volume).toBe(1 + 2);
      expect(store.bids.find(b => b.price === 3)!.volume).toBe(3 + 5);
      expect(store.asks.find(b => b.price === 5)!.volume).toBe(1 + 10);
      expect(store.asks.find(b => b.price === 6)!.volume).toBe(2 + 22);
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

      expect(store.bids).toHaveLength(0);
      expect(store.asks).toHaveLength(0);
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
        expect(store.bids.find(b => b.price === i)!.volume).toBe(i);
      }
      for (let i = 1; i < k; i++) {
        expect(store.asks.find(b => b.price === i)!.volume).toBe(i);
      }
    });
  });
});
