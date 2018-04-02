import {add} from 'rambda';
import MarketService from '../services/marketService';
import ReferenceStore from '../stores/referenceStore';

export default class WalletModel {
  symbol: string;
  balances: any[];
  id: string;
  profitAndLoss: number = 0;
  totalBalance: number = 0;
  type: string;

  constructor(wallet: any) {
    this.symbol = wallet.Name;
    this.id = wallet.Id;
    this.balances = wallet.Balances;
    this.type = wallet.Type;
  }

  updateTotalBalance = async (referenceStore: ReferenceStore) => {
    const baseAssetId = referenceStore.baseAssetId;

    this.totalBalance = this.balances
      .map(b =>
        MarketService.convert(
          b.Balance,
          b.AssetId,
          baseAssetId,
          referenceStore.getInstrumentById
        )
      )
      .reduce(add, 0);
  };
}
