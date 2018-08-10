import {computed, observable} from 'mobx';
import {add} from 'rambda';
import {AssetBalanceModel} from '.';
import {ApiAssetBalanceModel} from './assetBalanceModel';

export interface ApiWalletModel {
  Name: string;
  Id: string;
  Balances: ApiAssetBalanceModel[];
  Type: string;
}

export default class WalletModel {
  name: string;
  @observable balances: AssetBalanceModel[];
  id: string;
  profitAndLoss: number = 0;
  type: string;

  @computed
  get totalBalance() {
    return this.balances.map(b => b.balance).reduce(add, 0);
  }

  @computed
  get totalBalanceInBaseAsset() {
    return this.balances.map(b => b.balanceInBaseAsset).reduce(add, 0);
  }

  constructor(wallet: ApiWalletModel) {
    this.name = wallet.Name;
    this.id = wallet.Id;
    this.balances = wallet.Balances.map((b: any) => new AssetBalanceModel(b));
    this.type = wallet.Type;
  }
}
