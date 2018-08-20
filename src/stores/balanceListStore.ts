import {action, runInAction} from 'mobx';
import {add, pathOr} from 'rambda';
import {BalanceListApi} from '../api/index';
import * as topics from '../api/topics';
import {AssetBalanceModel, WalletModel, WalletType} from '../models';
import {ApiWalletModel} from '../models/walletModel';
import {BaseStore, RootStore} from './index';

class BalanceListStore extends BaseStore {
  tradingWallet: WalletModel;

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);

    this.tradingWallet = new WalletModel({
      Id: 'Trading',
      Name: 'Trading',
      Balances: [],
      Type: 'Trading'
    });
  }

  hasFundsOnBalance = () =>
    this.tradingWallet.balances.map(wallet => wallet.balance).reduce(add, 0) >
    0;

  getTotalBalance = () =>
    this.tradingWallet ? this.tradingWallet.totalBalance : 0;

  getTotalBalanceInBaseAsset = () =>
    this.tradingWallet ? this.tradingWallet.totalBalanceInBaseAsset : 0;

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        runInAction(() => {
          this.tradingWallet = resp
            .map((wallet: ApiWalletModel) => new WalletModel(wallet))
            .find((wallet: WalletModel) => wallet.type === WalletType.Trading);
        });
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  @action
  updateWalletBalances = async () => {
    const {
      baseAssetId,
      getInstrumentById,
      getAssetById,
      fetchAssetById
    } = this.rootStore.referenceStore;
    this.tradingWallet.balances.forEach(
      async (assetBalance: AssetBalanceModel) => {
        const {balance, id} = assetBalance;

        let asset = getAssetById(id);

        if (!asset) {
          asset = await fetchAssetById(id);
        }

        assetBalance.name = pathOr('', ['name'], asset);
        assetBalance.accuracy = pathOr('', ['accuracy'], asset);

        assetBalance.balanceInBaseAsset = this.rootStore.marketStore.convert(
          balance,
          id,
          baseAssetId,
          getInstrumentById
        );
      }
    );
  };

  subscribe = (session: any) => {
    session.subscribe(topics.balances, this.onUpdateBalance);
  };

  onUpdateBalance = async (args: any) => {
    const dto = args[0];
    const {id, a, b, r} = dto;
    if (this.tradingWallet && this.tradingWallet.id === id) {
      const balance = this.tradingWallet.balances.find(
        (bc: AssetBalanceModel) => bc.id === a
      );
      if (balance) {
        balance.balance = b;
        balance.reserved = r;
      } else {
        this.tradingWallet.balances.push(
          new AssetBalanceModel({
            AssetId: a,
            Balance: b,
            Reserved: r
          })
        );
      }
    }
  };

  refetchBalances = async () => {
    this.reset();
    await this.fetchAll();
    await this.updateWalletBalances();
  };

  reset = () => {
    this.tradingWallet = new WalletModel({
      Id: 'Trading',
      Name: 'Trading',
      Balances: [],
      Type: 'Trading'
    });
  };
}

export default BalanceListStore;
