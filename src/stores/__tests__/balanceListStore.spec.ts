import {MockBalanceListApi} from '../../api/balanceListApi';
import {BalanceListStore, RootStore} from '../index';

describe('balanceList store', () => {
  let balanceListStore: BalanceListStore;

  beforeEach(() => {
    balanceListStore = new BalanceListStore(
      new RootStore(false),
      new MockBalanceListApi({})
    );
  });

  describe('state', () => {
    it('balanceLists should be defined after instantiation', () => {
      expect(balanceListStore.getBalances).toBeDefined();
      expect(balanceListStore.getBalances).not.toBeNull();
    });

    it('balanceLists should be an empty array by default', () => {
      expect(balanceListStore.getBalances instanceof Array).toBeTruthy();
      expect(balanceListStore.getBalances.length).toBe(0);
    });

    it('tradingAssets should be defined after instantiation', () => {
      expect(balanceListStore.tradingWalletAssets).toBeDefined();
      expect(balanceListStore.tradingWalletAssets).not.toBeNull();
    });

    it('tradingAssets should be an empty array by default', () => {
      expect(
        balanceListStore.tradingWalletAssets instanceof Array
      ).toBeTruthy();
      expect(balanceListStore.tradingWalletAssets.length).toBe(0);
    });
  });
});
