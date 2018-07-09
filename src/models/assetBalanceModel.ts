import {computed, observable} from 'mobx';
import {subtraction} from '../utils/math';

class AssetBalanceModel {
  accuracy: number;
  id: string;
  name: string;
  @observable balance: number;
  @observable reserved: number;
  @observable balanceInBaseAsset: number = 0;

  @computed
  get available() {
    return +subtraction(this.balance, this.reserved);
  }

  constructor(dto: any) {
    this.id = dto.AssetId;
    this.balance = dto.Balance;
    this.reserved = dto.Reserved;
  }
}

export default AssetBalanceModel;
