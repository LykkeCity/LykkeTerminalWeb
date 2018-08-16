export interface CsvIdRequestModel {
  OperationType: string[];
  AssetId: string;
  AssetPairId: string;
}

export interface CsvIdResponseModel {
  Id?: string;
}

export interface CsvLinkRequestModel {
  id?: string;
}

export interface CsvLinkResponseModel {
  Url: string;
}
