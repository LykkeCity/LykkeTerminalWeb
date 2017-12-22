import {computed, observable, runInAction} from 'mobx';
import {BalanceListApi} from '../api/index';
import {BalanceModel} from '../models/balanceModel';
import {BaseStore, RootStore} from './index';

class BalanceListStore extends BaseStore {
  @computed
  get allBalanceLists() {
    return this.balanceLists;
  }

  @computed
  get totalBalance() {
    return this.balanceLists.reduce(
      (sum: number, balanceList: BalanceModel) => {
        return sum + balanceList.balance;
      },
      0
    );
  }

  @observable private balanceLists: any[] = [];
  private parentStore: RootStore;

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
    this.parentStore = store;
  }

  fetchAll = async () => {
    const balanceListDto = await this.api.fetchAll();
    runInAction(async () => {
      const tempBalanceLists = balanceListDto.map(
        (wallet: any) => new BalanceModel(wallet)
      );
      this.updateBalance(tempBalanceLists);
    });
  };

  updateBalance = async (
    tempBalanceLists: BalanceModel[] = this.balanceLists
  ) => {
    const promises = tempBalanceLists.map((balanceList: BalanceModel) => {
      return balanceList.updateBalance(this.parentStore.assetStore);
    });
    await Promise.all(promises);
    this.balanceLists = [...tempBalanceLists];
  };

  reset = () => {
    this.balanceLists = [];
  };
}

export default BalanceListStore;
