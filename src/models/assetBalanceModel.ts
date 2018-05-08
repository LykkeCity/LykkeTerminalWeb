import {computed, observable} from 'mobx';

class AssetBalanceModel {
  accuracy: number;
  id: string;
  name: string;
  @observable balance: number;
  @observable reserved: number;
  @observable balanceInBaseAsset: number = 0;

  @computed
  get available() {
    return this.balance - this.reserved;
  }

  constructor(dto: any) {
    this.id = dto.AssetId;
    this.balance = dto.Balance;
    this.reserved = dto.Reserved;
  }
}

export default AssetBalanceModel;
