// import {RestMarketsApi} from '../api/marketsApi';
// import Side from '../stores/side';
//
// const marketsApi = new RestMarketsApi();
import MarketService from '../services/marketService';
import AssetStore from '../stores/assetStore';

export class BalanceModel {
  symbol: string;
  balances: any[];
  id: string;
  profitAndLoss: number = 1;
  balance: number = 1;

  constructor(wallet: any) {
    this.symbol = wallet.Name;
    this.id = wallet.Id;
    this.balances = wallet.Balances;
  }

  updateBalance = async (assetStore: AssetStore) => {
    let balances: any[] = [];
    const baseAsset = assetStore.baseAssetId;
    const notBasedAssets = this.balances.filter(
      balance => balance.AssetId !== baseAsset
    );
    balances = [
      ...balances,
      ...this.balances.filter(balance => balance.AssetId === baseAsset)
    ];

    if (notBasedAssets.length) {
      const updatedBalances: any[] = await MarketService.updateQuotes(
        notBasedAssets,
        baseAsset
      );
      balances = [...balances, ...updatedBalances];
    }

    this.balance = await balances.reduce((sum: number, quote: any) => {
      return sum + quote.Balance;
    }, 0);
  };
}
