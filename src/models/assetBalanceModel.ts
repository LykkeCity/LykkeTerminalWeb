import {computed, observable} from 'mobx';

class AssetBalanceModel {
  accuracy: number;
  id: string;
  name: string;
  @observable balance: number;
  @observable reserved: number;

  @computed
  get available() {
    return this.balance - this.reserved;
  }

  constructor(assetsBalance: any) {
    this.id = assetsBalance.AssetId;
    this.balance = assetsBalance.Balance;
    this.reserved = assetsBalance.Reserved;
  }
}

export default AssetBalanceModel;
