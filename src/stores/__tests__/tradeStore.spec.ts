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
          Amount: 6500,
          Asset: 'BTC',
          DateTime: new Date(),
          Id: 1
        }
      ])
    );

    tradeStore = new TradeStore(new RootStore(false), api);
  });

  describe('state', () => {
    it('trades should be defined after instantiation', () => {
      expect(tradeStore.getAllTrades).toBeDefined();
      expect(tradeStore.getAllTrades).not.toBeNull();
    });

    it('trades should be an empty array by default', () => {
      expect(tradeStore.getAllTrades instanceof Array).toBeTruthy();
      expect(tradeStore.getAllTrades.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear trades', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.getAllTrades.length).toBeGreaterThan(0);

      tradeStore.reset();

      expect(tradeStore.getAllTrades.length).toBe(0);
    });
  });

  describe('fetch trades', () => {
    it('should populate tradeList collection', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.getAllTrades.length).toBeGreaterThan(0);
    });
  });

  describe('trade item', () => {
    it('should contain the following fields', async () => {
      await tradeStore.fetchAll();
      const trade = tradeStore.getAllTrades[0];
      expect(trade.side).toBeDefined();
      expect(trade.asset).toBeDefined();
      expect(trade.quantity).toBeDefined();
      expect(trade.timestamp).toBeDefined();
    });
  });

  describe('add public trade', () => {
    it('should add to public trades collection', () => {
      tradeStore.addPublicTrade({
        asset: 'LKK',
        quantity: 1,
        timestamp: Date.now().toString(),
        // tslint:disable-next-line:object-literal-sort-keys
        side: 'Buy',
        tradeId: 't1',
        id: '1'
      });
      expect(tradeStore.getPublicTrades).toHaveLength(1);
      expect(tradeStore.getAllTrades).toHaveLength(0);
    });
  });
});
