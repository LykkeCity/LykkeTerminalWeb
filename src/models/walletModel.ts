import {observable} from 'mobx';
import {AssetBalanceModel} from '.';

export default class WalletModel {
  name: string;
  balances: any[];
  id: string;
  profitAndLoss: number = 0;
  type: string;

  @observable totalBalance: number = 0;

  constructor(wallet: any) {
    this.name = wallet.Name;
    this.id = wallet.Id;
    this.balances = wallet.Balances.map((b: any) => new AssetBalanceModel(b));
    this.type = wallet.Type;
  }
}
