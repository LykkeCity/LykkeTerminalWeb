export default interface MarketDataModel {
  AssetPairId: string;
  VolumeBase: number;
  VolumeQuote: number;
  PriceChange: number;
  LastPrice: number;
  High: number;
  Low: number;
}
