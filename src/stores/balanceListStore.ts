import {computed, observable, runInAction} from 'mobx';
import {add} from 'rambda';
import {BalanceListApi} from '../api/index';
import keys from '../constants/tradingWalletKeys';
import {AssetBalanceModel, BalanceModel} from '../models';
import {BaseStore, RootStore} from './index';

class BalanceListStore extends BaseStore {
  @computed
  get getBalances() {
    return this.balanceLists.sort(
      (a: BalanceModel, b: BalanceModel) => b.balance - a.balance
    );
  }

  @computed
  get totalBalance() {
    return this.balanceLists.map(b => b.balance).reduce(add, 0);
  }

  @computed
  get tradingWalletAssets() {
    return this.tradingAssets;
  }

  @computed
  get totalWalletAssetsBalance() {
    return this.balanceLists.length
      ? this.getTradingWallet(this.balanceLists).balance
      : 0;
  }

  @observable private balanceLists: any[] = [];
  @observable private tradingAssets: any[] = [];

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
  }

  fetchAll = async () => {
    const balanceListDto = await this.api.fetchAll();
    runInAction(async () => {
      const tempBalanceLists = balanceListDto.map(
        (wallet: any) => new BalanceModel(wallet)
      );
      this.updateBalance(tempBalanceLists);
      this.setTradingAssets(tempBalanceLists);
    });
  };

  updateBalance = async (
    tempBalanceLists: BalanceModel[] = this.balanceLists
  ) => {
    const promises = tempBalanceLists.map((balanceList: BalanceModel) => {
      return balanceList.updateBalance(this.rootStore.referenceStore);
    });
    await Promise.all(promises);
    this.balanceLists = [...tempBalanceLists];
  };

  setTradingAssets = (balanceList: BalanceModel[]) => {
    this.tradingAssets = this.getTradingWallet(balanceList).balances.map(
      (assetsBalance: any) => new AssetBalanceModel(assetsBalance)
    );
  };

  reset = () => {
    this.balanceLists = [];
  };

  private getTradingWallet = (balanceList: BalanceModel[]) => {
    return balanceList.find(b => b.type === keys.trading)!;
  };
}

export default BalanceListStore;
