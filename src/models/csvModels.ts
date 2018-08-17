export interface CsvIdRequestModel {
  OperationType: string[];
  AssetId: string;
  AssetPairId: string;
}

export interface CsvIdResponseModel {
  Id?: string;
}

export interface CsvWampModel {
  Id: string;
  Url: string;
}
