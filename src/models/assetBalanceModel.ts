import {safeMath} from '@lykkex/lykke.js';
import {computed, observable} from 'mobx';

export interface ApiAssetBalanceModel {
  AssetId: string;
  Balance: number;
  Reserved: number;
}

class AssetBalanceModel {
  accuracy: number;
  id: string;
  @observable name: string;
  @observable balance: number;
  @observable reserved: number;
  @observable balanceInBaseAsset: number = 0;

  @computed
  get available() {
    return safeMath.sub(this.balance, this.reserved).valueOf();
  }

  constructor(dto: any) {
    this.id = dto.AssetId;
    this.balance = dto.Balance;
    this.reserved = dto.Reserved;
  }
}

export default AssetBalanceModel;
