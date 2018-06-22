class AssetResponseModel {
  Id: string;
  Name: string;
  DisplayId: string;
  Accuracy: 0;
  KycNeeded: boolean;
  BankCardsDepositEnabled: boolean;
  SwiftDepositEnabled: boolean;
  BlockchainDepositEnabled: boolean;
  CategoryId: string;
  IsBase: boolean;
  CanBeBase: boolean;
  IconUrl: string;
}

export default AssetResponseModel;
