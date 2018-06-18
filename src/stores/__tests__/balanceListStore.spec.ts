import {
  MockBalanceListApi,
  MockBalanceListApiNullBalance
} from '../../api/balanceListApi';
import {AssetModel, WalletType} from '../../models';
import {BalanceListStore, RootStore} from '../index';

describe('balanceList store', () => {
  let balanceListStore: BalanceListStore;

  beforeEach(() => {
    balanceListStore = new BalanceListStore(
      new RootStore(),
      new MockBalanceListApi({})
    );
    balanceListStore.rootStore.referenceStore.fetchAssetById = jest.fn();
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

    describe('should update asset balance', () => {
      const asset = new AssetModel({
        id: 'BTC',
        name: 'BTC',
        accuracy: 8
      });

      const unknownAsset = new AssetModel({
        id: 'GBP',
        name: 'GBP',
        accuracy: 3
      });

      const assets = [asset];
      const convertedBalance = 0;
      const customWallet = {
        ApiKey: null,
        Balances: [{AssetId: 'BTC', Balance: 200, Reserved: 20}],
        Description: 'Default trading wallet',
        Id: '0269b387-09de-40f0-b6a8-ca2950576ac0',
        Name: 'Trading Wallet',
        Type: 'Trading'
      };

      beforeEach(() => {
        balanceListStore.rootStore.referenceStore.getAssetById = (id: string) =>
          assets.find(a => a.id === id);
        balanceListStore.rootStore.marketStore.convert = () => convertedBalance;
        balanceListStore.rootStore.referenceStore.fetchAssetById = jest.fn(() =>
          Promise.resolve(unknownAsset)
        );
      });

      it('with info from asset with the same id', async () => {
        await balanceListStore.fetchAll();
        await balanceListStore.updateWalletBalances();
        const wallet = balanceListStore.getWalletsWithPositiveBalances.find(
          w => w.id === customWallet.Id
        );
        const balance = wallet!.balances.find(b => b.id === asset.id);
        expect(balance!.name).toBe(asset.name);
        expect(balance!.accuracy).toBe(asset.accuracy);
        expect(balance!.balanceInBaseAsset).toBe(convertedBalance);
      });

      it('should call fetchAssetById for unknown asset id', async () => {
        await balanceListStore.fetchAll();
        await balanceListStore.updateWalletBalances();
        expect(
          balanceListStore.rootStore.referenceStore.fetchAssetById
        ).toHaveBeenCalled();
        const wallet = balanceListStore.getWalletsWithPositiveBalances.find(
          w => w.id === customWallet.Id
        );
        const balance = wallet!.balances.find(b => b.id === unknownAsset.id);
        expect(balance!.name).toBe(unknownAsset.name);
        expect(balance!.accuracy).toBe(unknownAsset.accuracy);
      });
    });
  });
});
