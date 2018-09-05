import {MockBalanceListApi} from '../../api/mocks/balanceListApi';
import {
  AssetBalanceModel,
  AssetModel,
  WalletModel,
  WalletType
} from '../../models';
import {BalanceListStore, RootStore} from '../index';

const getTestTradingWallet = () => {
  return new WalletModel({
    Id: 'Trading',
    Name: 'Trading',
    Balances: [],
    Type: 'Trading'
  });
};

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
    it("should fetch user's wallets and set Trading Wallet", async () => {
      balanceListStore.updateWalletBalances = jest.fn();

      await balanceListStore.fetchAll();
      expect(balanceListStore.tradingWallet).toBeDefined();
    });

    it('should be funds on balance after fetching', async () => {
      balanceListStore.updateWalletBalances = jest.fn();

      await balanceListStore.fetchAll();
      expect(balanceListStore.getTotalBalance()).toBeTruthy();
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
      const wallet = balanceListStore.tradingWallet;
      const balance = wallet!.balances.find(b => b.id === dto[0].a);
      expect(wallet!.type).toBe(WalletType.Trading);
      expect(balance!.balance).not.toBe(dto[0].b);
      expect(balance!.reserved).not.toBe(dto[0].r);

      balanceListStore.onUpdateBalance(dto);
      expect(balance!.balance).toBe(dto[0].b);
      expect(balance!.reserved).toBe(dto[0].r);
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
        const wallet = balanceListStore.tradingWallet;
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
        const wallet = balanceListStore.tradingWallet;
        const balance = wallet!.balances.find(b => b.id === unknownAsset.id);
        expect(balance!.name).toBe(unknownAsset.name);
        expect(balance!.accuracy).toBe(unknownAsset.accuracy);
      });
    });

    describe('method hasFundsOnBalance', () => {
      it('should return false if trading wallet have no positive balance', () => {
        balanceListStore.tradingWallet = getTestTradingWallet();
        balanceListStore.tradingWallet.balances = [
          new AssetBalanceModel({Balance: 0})
        ];
        expect(balanceListStore.hasFundsOnBalance()).toBe(false);
      });

      it('should return true if trading wallet have at least one positive balance', () => {
        balanceListStore.tradingWallet = getTestTradingWallet();
        balanceListStore.tradingWallet.balances = [
          new AssetBalanceModel({Balance: 2000}),
          new AssetBalanceModel({Balance: 3000}),
          new AssetBalanceModel({Balance: 5000})
        ];
        expect(balanceListStore.hasFundsOnBalance()).toBe(true);
      });
    });

    describe('method getTotalBalance', () => {
      it('should return sum of balances from trading balances', () => {
        balanceListStore.tradingWallet = getTestTradingWallet();
        balanceListStore.tradingWallet.balances = [
          new AssetBalanceModel({Balance: 2000}),
          new AssetBalanceModel({Balance: 3000}),
          new AssetBalanceModel({Balance: 5000})
        ];
        expect(balanceListStore.getTotalBalance()).toBe(10000);
      });
    });

    describe('method getTotalBalanceInBaseAsset', () => {
      it('should return sum of balances in base asset from trading balances', () => {
        balanceListStore.tradingWallet = getTestTradingWallet();
        balanceListStore.tradingWallet.balances = [
          new AssetBalanceModel({Balance: 2000}),
          new AssetBalanceModel({Balance: 3000}),
          new AssetBalanceModel({Balance: 5000})
        ];
        balanceListStore.tradingWallet.balances.forEach(balanceModel => {
          balanceModel.balanceInBaseAsset = balanceModel.balance;
        });
        expect(balanceListStore.getTotalBalanceInBaseAsset()).toBe(10000);
      });
    });
  });
});
