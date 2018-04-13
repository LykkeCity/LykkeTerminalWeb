import {computed, observable, runInAction} from 'mobx';
import {add} from 'rambda';
import {BalanceListApi} from '../api/index';
import * as topics from '../api/topics';
import keys from '../constants/tradingWalletKeys';
import {AssetBalanceModel, WalletModel} from '../models';
import {BaseStore, RootStore} from './index';

class BalanceListStore extends BaseStore {
  @computed
  get getWalletsWithPositiveBalances() {
    return this.walletList
      .filter(b => b.totalBalance > 0)
      .sort((a, b) => b.totalBalance - a.totalBalance);
  }

  @computed
  get totalBalance() {
    return this.walletList.map(b => b.totalBalance).reduce(add, 0);
  }

  @computed
  get availableBalance() {
    const tradingWallet = this.getTradingWallet(this.walletList);
    return tradingWallet
      ? tradingWallet.balances.filter((b: AssetBalanceModel) => b.id)
      : [];
  }

  @computed
  get currentWalletTotalBalance() {
    return this.currentWallet
      ? this.currentWallet.totalBalance
      : this.getWalletsWithPositiveBalances[0]
        ? this.getWalletsWithPositiveBalances[0].totalBalance
        : 0;
  }

  @computed
  get getCurrentWalletModel() {
    return this.currentWallet
      ? this.currentWallet
      : this.getWalletsWithPositiveBalances[0];
  }

  @observable private walletList: WalletModel[] = [];
  @observable private currentWallet: WalletModel;

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
  }

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        runInAction(() => {
          this.walletList = resp.map((wallet: any) => new WalletModel(wallet));
          this.updateWalletBalances();
        });
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  updateWalletBalances = (walletList: WalletModel[] = this.walletList) => {
    walletList.forEach((wallet: WalletModel) => {
      wallet.totalBalance = 0;
      wallet.balances.forEach((assetBalance: AssetBalanceModel) => {
        const {baseAssetId, getInstrumentById} = this.rootStore.referenceStore;
        const {balance, id} = assetBalance;

        assetBalance.balanceInBaseAsset = this.rootStore.marketStore.convert(
          balance,
          id,
          baseAssetId,
          getInstrumentById
        );
        wallet.totalBalance += assetBalance.balanceInBaseAsset;
      });
    });
  };

  selectWallet = async (index: number) => {
    this.currentWallet = this.getWalletsWithPositiveBalances[index];
  };

  subscribe = (session: any) => {
    session.subscribe(topics.balances, this.onUpdateBalance);
  };

  onUpdateBalance = async (args: any) => {
    const dto = args[0];
    const {id, a, b, r} = dto;
    const wallet = this.walletList.find((w: WalletModel) => w.id === id);
    const balance: AssetBalanceModel = wallet!.balances.find(
      (bc: AssetBalanceModel) => bc.id === a
    );
    balance.balance = b;
    balance.reserved = r;

    this.updateWalletBalances(this.walletList);
  };

  reset = () => {
    this.walletList = [];
  };

  private getTradingWallet = (walletList: WalletModel[]) => {
    return walletList.find(b => b.type === keys.trading)!;
  };
}

export default BalanceListStore;
