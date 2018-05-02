import {
  MockBalanceListApi,
  MockBalanceListApiNullBalance
} from '../../api/balanceListApi';
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
      expect(balanceListStore.getWalletsWithPositiveBalances).toBeDefined();
      expect(balanceListStore.getWalletsWithPositiveBalances).not.toBeNull();
    });

    it('balanceLists should be an empty array by default', () => {
      expect(balanceListStore.getBalances instanceof Array).toBeTruthy();
      expect(balanceListStore.getBalances.length).toBe(0);
    });

    it("should fetch user's wallets and set Trading Wallet", async () => {
      balanceListStore.updateWalletBalances = jest.fn();

      await balanceListStore.fetchAll();
      expect(balanceListStore.tradingWallet).toBeDefined();
    });

    it('should be funds on balance after fetching', async () => {
      balanceListStore.updateWalletBalances = jest.fn();

      await balanceListStore.fetchAll();
      expect(balanceListStore.fundsOnBalance).toBeTruthy();
    });

    it('should be no funds on balance after fetching from empty balances', async () => {
      balanceListStore = new BalanceListStore(
        new RootStore(false),
        new MockBalanceListApiNullBalance({})
      );
      balanceListStore.updateWalletBalances = jest.fn();

      await balanceListStore.fetchAll();
      expect(balanceListStore.fundsOnBalance).toBeFalsy();
    });
  });
});
