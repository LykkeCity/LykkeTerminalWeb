import {MockBalanceListApi} from '../../api/balanceListApi';
import {BalanceListStore, RootStore} from '../index';

describe('tradeList store', () => {
  let balanceListStore: BalanceListStore;

  beforeEach(() => {
    balanceListStore = new BalanceListStore(
      new RootStore(false),
      new MockBalanceListApi()
    );
  });

  describe('state', () => {
    it('tradeLists should be defined after instantiation', () => {
      expect(balanceListStore.allBalanceLists).toBeDefined();
      expect(balanceListStore.allBalanceLists).not.toBeNull();
    });

    it('tradeLists should be an empty array by default', () => {
      expect(balanceListStore.allBalanceLists instanceof Array).toBeTruthy();
      expect(balanceListStore.allBalanceLists.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear tradeLists', async () => {
      await balanceListStore.fetchAll();
      expect(balanceListStore.allBalanceLists.length).toBeGreaterThan(0);

      balanceListStore.reset();

      expect(balanceListStore.allBalanceLists.length).toBe(0);
    });
  });

  describe('fetch tradeLists', () => {
    it('should populate tradeList collection', async () => {
      await balanceListStore.fetchAll();
      expect(balanceListStore.allBalanceLists.length).toBeGreaterThan(0);
    });
  });

  describe('trade item', () => {
    it('should contain the following fields', async () => {
      await balanceListStore.fetchAll();
      expect(balanceListStore.allBalanceLists[0].id).toBeDefined();
      expect(balanceListStore.allBalanceLists[0].balance).toBeDefined();
      expect(balanceListStore.allBalanceLists[0].symbol).toBeDefined();
      expect(balanceListStore.allBalanceLists[0].profitAndLoss).toBeDefined();
    });
  });
});
