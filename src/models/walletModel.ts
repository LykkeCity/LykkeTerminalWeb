import {add, without} from 'rambda';
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

    const balancesInBaseAsset = this.balances.filter(
      balance => balance.AssetId === baseAssetId
    );
    let balancesNotInBaseAsset = without(balancesInBaseAsset, this.balances);

    if (balancesNotInBaseAsset.length > 0) {
      balancesNotInBaseAsset = await MarketService.convert(
        balancesNotInBaseAsset,
        baseAssetId
      );
    }

    this.totalBalance = await [
      ...balancesInBaseAsset,
      ...balancesNotInBaseAsset
    ]
      .map(b => b.Balance)
      .reduce(add, 0);
  };
}
