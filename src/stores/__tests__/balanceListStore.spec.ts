import {
  MockBalanceListApi,
  MockBalanceListApiNullBalance
} from '../../api/balanceListApi';
import {WalletType} from '../../models';
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

    it('should update wallet', async () => {
      balanceListStore.updateWalletBalances = jest.fn();
      const dto = [
        {
          a: 'BTC',
          b: 32046.87829743,
          id: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          r: 1.37872652
        }
      ];
      await balanceListStore.fetchAll();
      const wallet = balanceListStore.getWalletsWithPositiveBalances.find(
        w => w.id === dto[0].id
      );
      const balance = wallet!.balances.find(b => b.id === dto[0].a);
      expect(wallet!.type).toBe(WalletType.Trading);
      expect(balance!.balance).not.toBe(dto[0].b);
      expect(balance!.reserved).not.toBe(dto[0].r);

      balanceListStore.onUpdateBalance(dto);
      expect(balance!.balance).toBe(dto[0].b);
      expect(balance!.reserved).toBe(dto[0].r);
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
