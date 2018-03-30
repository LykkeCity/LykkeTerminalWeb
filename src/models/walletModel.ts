import MarketService from '../services/marketService';
import ReferenceStore from '../stores/referenceStore';

export default class WalletModel {
  name: string;
  balances: any[];
  id: string;
  profitAndLoss: number = 0;
  totalBalance: number = 0;
  type: string;

  constructor(wallet: any) {
    this.name = wallet.Name;
    this.id = wallet.Id;
    this.balances = wallet.Balances;
    this.type = wallet.Type;
  }

  update = async (referenceStore: ReferenceStore) => {
    const baseAssetId = referenceStore.baseAssetId;

    const convertedBalances = await MarketService.convert(
      this.balances,
      baseAssetId
    );
    this.totalBalance = 0;
    this.balances = this.balances.map((b, index) => {
      if (b.AssetId === baseAssetId) {
        b.balanceInBaseAsset = b.Balance;
      } else {
        b.balanceInBaseAsset = convertedBalances[index].Balance;
      }
      this.totalBalance += b.balanceInBaseAsset;
      return b;
    });
  };
}
