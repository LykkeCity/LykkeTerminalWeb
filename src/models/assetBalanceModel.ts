class AssetBalanceModel {
  id: string;
  name: string;
  balance: number;
  reserved: number;

  constructor(assetsBalance: any) {
    this.id = assetsBalance.AssetId;
    this.balance = assetsBalance.Balance;
    this.reserved = assetsBalance.Reserved;
  }
}

export default AssetBalanceModel;
