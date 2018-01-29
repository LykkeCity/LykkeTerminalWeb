import {RootStore, TradeStore} from '../index';

describe('trade store', () => {
  let tradeStore: TradeStore;
  const api: any = {
    fetchAll: jest.fn()
  };

  beforeEach(() => {
    api.fetchAll = jest.fn(() =>
      Promise.resolve([
        {
          Trade: {
            Asset: 'BTC',
            DateTime: new Date(),
            Direction: 'Buy',
            OppositeAsset: 'USD',
            Price: 6500,
            TradeId: 1,
            Volume: 10
          }
        }
      ])
    );

    tradeStore = new TradeStore(new RootStore(false), api);
  });

  describe('state', () => {
    it('trades should be defined after instantiation', () => {
      expect(tradeStore.allTrades).toBeDefined();
      expect(tradeStore.allTrades).not.toBeNull();
    });

    it('trades should be an empty array by default', () => {
      expect(tradeStore.allTrades instanceof Array).toBeTruthy();
      expect(tradeStore.allTrades.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear trades', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.allTrades.length).toBeGreaterThan(0);

      tradeStore.reset();

      expect(tradeStore.allTrades.length).toBe(0);
    });
  });

  describe('fetch trades', () => {
    it('should populate tradeList collection', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.allTrades.length).toBeGreaterThan(0);
    });
  });

  describe('trade item', () => {
    it('should contain the following fields', async () => {
      await tradeStore.fetchAll();
      const trade = tradeStore.allTrades[0];
      expect(trade.side).toBeDefined();
      expect(trade.asset).toBeDefined();
      expect(trade.quantity).toBeDefined();
      expect(trade.timestamp).toBeDefined();
    });
  });
});
