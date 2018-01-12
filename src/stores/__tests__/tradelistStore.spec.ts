import {MockTradeListApi} from '../../api/tradeListApi';
import {RootStore, TradeListStore} from '../index';

describe('tradeList store', () => {
  let tradeListStore: TradeListStore;

  beforeEach(() => {
    tradeListStore = new TradeListStore(
      new RootStore(false),
      new MockTradeListApi()
    );
  });

  describe('state', () => {
    it('tradeLists should be defined after instantiation', () => {
      expect(tradeListStore.allTradeLists).toBeDefined();
      expect(tradeListStore.allTradeLists).not.toBeNull();
    });

    it('tradeLists should be an empty array by default', () => {
      expect(tradeListStore.allTradeLists instanceof Array).toBeTruthy();
      expect(tradeListStore.allTradeLists.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear tradeLists', async () => {
      await tradeListStore.fetchAll();
      expect(tradeListStore.allTradeLists.length).toBeGreaterThan(0);

      tradeListStore.reset();

      expect(tradeListStore.allTradeLists.length).toBe(0);
    });
  });

  describe('fetch tradeLists', () => {
    it('should populate tradeList collection', async () => {
      await tradeListStore.fetchAll();
      expect(tradeListStore.allTradeLists.length).toBeGreaterThan(0);
    });
  });

  describe('trade item', () => {
    it('should contain the following fields', async () => {
      await tradeListStore.fetchAll();
      const trade = tradeListStore.allTradeLists[0];
      expect(trade.side).toBeDefined();
      expect(trade.symbol).toBeDefined();
      expect(trade.quantity).toBeDefined();
      expect(trade.timestamp).toBeDefined();
      expect(trade.price).toBeDefined();
    });
  });
});
