import {MockBalanceListApi} from '../../api/balanceListApi';
import {BalanceListStore, RootStore} from '../index';

describe('balanceList store', () => {
  let balanceListStore: BalanceListStore;

  beforeEach(() => {
    balanceListStore = new BalanceListStore(
      new RootStore(false),
      new MockBalanceListApi()
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
});
