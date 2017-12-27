import {RestMarketsApi} from '../api/marketsApi';
import Side from '../stores/enums/side';

const marketsApi = new RestMarketsApi();

export default class MarketService {
  static updateQuotes = async (assets: any, assetId: string | null) => {
    const convertedQuotes = await marketsApi.convert({
      AssetsFrom: assets.map((asset: any) => {
        return {
          Amount: asset.Balance,
          AssetId: asset.AssetId
        };
      }),
      BaseAssetId: assetId,
      OrderAction: Side.Sell
    });
    return convertedQuotes.Converted.map((converted: any) => {
      return {
        AssetId: converted.To ? converted.To.AssetId : null,
        Balance: converted.To ? converted.To.Amount : 0
      };
    });
  };
}
