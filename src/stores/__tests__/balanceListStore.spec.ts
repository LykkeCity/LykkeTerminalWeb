import {RestBalanceListApi} from '../../api/balanceListApi';
import {BalanceListStore, RootStore} from '../index';

describe('balanceList store', () => {
  let balanceListStore: BalanceListStore;

  beforeEach(() => {
    balanceListStore = new BalanceListStore(
      new RootStore(false),
      new RestBalanceListApi()
    );
  });

  describe('state', () => {
    it('balanceLists should be defined after instantiation', () => {
      expect(balanceListStore.allBalanceLists).toBeDefined();
      expect(balanceListStore.allBalanceLists).not.toBeNull();
    });

    it('balanceLists should be an empty array by default', () => {
      expect(balanceListStore.allBalanceLists instanceof Array).toBeTruthy();
      expect(balanceListStore.allBalanceLists.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear balanceLists', async () => {
      await balanceListStore.fetchAll();
      expect(balanceListStore.allBalanceLists.length).toBeGreaterThan(0);

      balanceListStore.reset();

      expect(balanceListStore.allBalanceLists.length).toBe(0);
    });
  });

  describe('fetch balanceLists', () => {
    it('should populate balanceList collection', async () => {
      await balanceListStore.fetchAll();
      expect(balanceListStore.allBalanceLists.length).toBeGreaterThan(0);
    });
  });

  describe('balance item', () => {
    it('should contain the following fields', async () => {
      await balanceListStore.fetchAll();
      const balance = balanceListStore.allBalanceLists[0];
      expect(balance.id).toBeDefined();
      expect(balance.balance).toBeDefined();
      expect(balance.symbol).toBeDefined();
      expect(balance.profitAndLoss).toBeDefined();
    });
  });
});
