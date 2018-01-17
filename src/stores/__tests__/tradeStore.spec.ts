import {MockTradeApi} from '../../api/tradeApi';
import {RootStore, TradeStore} from '../index';

describe('trade store', () => {
  let tradeStore: TradeStore;

  beforeEach(() => {
    tradeStore = new TradeStore(new RootStore(false), new MockTradeApi());
  });

  describe('state', () => {
    it('trades should be defined after instantiation', () => {
      expect(tradeStore.allTradeLists).toBeDefined();
      expect(tradeStore.allTradeLists).not.toBeNull();
    });

    it('trades should be an empty array by default', () => {
      expect(tradeStore.allTradeLists instanceof Array).toBeTruthy();
      expect(tradeStore.allTradeLists.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear trades', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.allTradeLists.length).toBeGreaterThan(0);

      tradeStore.reset();

      expect(tradeStore.allTradeLists.length).toBe(0);
    });
  });

  describe('fetch trades', () => {
    it('should populate tradeList collection', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.allTradeLists.length).toBeGreaterThan(0);
    });
  });

  describe('trade item', () => {
    it('should contain the following fields', async () => {
      await tradeStore.fetchAll();
      const trade = tradeStore.allTradeLists[0];
      expect(trade.side).toBeDefined();
      expect(trade.symbol).toBeDefined();
      expect(trade.quantity).toBeDefined();
      expect(trade.timestamp).toBeDefined();
      expect(trade.price).toBeDefined();
    });
  });
});
