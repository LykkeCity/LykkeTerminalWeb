import {action, computed, observable, runInAction} from 'mobx';
import {add, find, pathOr} from 'rambda';
import {BalanceListApi} from '../api/index';
import * as topics from '../api/topics';
import {AssetBalanceModel, WalletModel, WalletType} from '../models';
import {BaseStore, RootStore} from './index';

class BalanceListStore extends BaseStore {
  @computed
  get getWalletsWithPositiveBalances() {
    return this.walletList
      .filter(b => b.totalBalance > 0)
      .sort((a, b) => b.totalBalance - a.totalBalance);
  }

  @computed
  get getBalances() {
    return this.walletList
      .filter(b => b.totalBalance > 0)
      .sort((a, b) => b.totalBalance - a.totalBalance);
  }

  @computed
  get totalBalance() {
    return this.walletList
      .map(wallet => wallet.totalBalanceInBaseAsset)
      .reduce(add, 0);
  }

  @computed
  get fundsOnBalance() {
    return (
      this.walletList.map(wallet => wallet.totalBalance).reduce(add, 0) > 0
    );
  }

  @computed
  get tradingWalletBalances() {
    return (this.tradingWallet && this.tradingWallet.balances) || [];
  }

  @observable currentWalletId: string;

  @computed
  get currentWallet() {
    return (
      this.walletList.find(w => w.id === this.currentWalletId) ||
      this.walletList.find(w => w.type === WalletType.Trading)
    );
  }

  @computed
  get tradingWallet() {
    return find(w => w.type === WalletType.Trading, this.walletList);
  }

  @observable.shallow private walletList: WalletModel[] = [];

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
  }

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        runInAction(() => {
          this.walletList = resp.map((wallet: any) => new WalletModel(wallet));
        });
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  @action
  updateWalletBalances = () => {
    const {
      baseAssetId,
      getInstrumentById,
      getAssetById
    } = this.rootStore.referenceStore;
    this.walletList.forEach(wallet => {
      wallet.balances.forEach((assetBalance: AssetBalanceModel) => {
        const {balance, id} = assetBalance;

        const asset = getAssetById(id);

        assetBalance.name = pathOr('', ['name'], asset);
        assetBalance.accuracy = pathOr('', ['accuracy'], asset);

        assetBalance.balanceInBaseAsset = this.rootStore.marketStore.convert(
          balance,
          id,
          baseAssetId,
          getInstrumentById
        );
      });
    });
  };

  changeWallet = (walletId: string) => {
    this.currentWalletId = walletId;
  };

  subscribe = (session: any) => {
    session.subscribe(topics.balances, this.onUpdateBalance);
  };

  onUpdateBalance = async (args: any) => {
    const dto = args[0];
    const {id, a, b, r} = dto;
    const wallet = this.walletList.find((w: WalletModel) => w.id === id)!;
    if (wallet && wallet.type === WalletType.Trading) {
      const balance = wallet.balances.find(
        (bc: AssetBalanceModel) => bc.id === a
      );
      if (balance) {
        balance.balance = b;
        balance.reserved = r;
      } else {
        wallet.balances.push(
          new AssetBalanceModel({
            AssetId: a,
            Balance: b,
            Reserved: r
          })
        );
      }

      this.updateWalletBalances();
    }
  };

  reset = () => {
    this.walletList = [];
  };
}

export default BalanceListStore;
