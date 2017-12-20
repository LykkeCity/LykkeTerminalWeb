import {computed, observable, runInAction} from 'mobx';
import {BalanceListApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class BalanceListStore extends BaseStore {
  @computed
  get allBalanceLists() {
    return this.balanceLists;
  }

  @observable private balanceLists: any[] = [];

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
  }

  createBalanceList = ({balance, id, profitAndLoss, symbol, test}: any) => ({
    balance,
    id,
    profitAndLoss,
    symbol,
    test
  });

  fetchAll = async () => {
    const balanceListDto = await this.api.fetchAll();
    runInAction(() => {
      this.balanceLists = balanceListDto.map(this.createBalanceList);
    });
  };

  reset = () => {
    this.balanceLists = [];
  };
}

export default BalanceListStore;
