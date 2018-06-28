interface HistoryResponseModel {
  Id?: string;
  DateTime: string;
  Type: string;
  State: string;
  Amount: number;
  Asset?: string;
  AssetPair?: string;
  Price?: number;
  FeeSize: number;
  FeeType: string;
}

export default HistoryResponseModel;
