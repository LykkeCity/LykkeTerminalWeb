export default interface OrderListItemInterface {
  createdDate: Date;
  currentPrice: number;
  currentPriceSide: number;
  expiryDate: string;
  id: number;
  orderID: number;
  openPrice: number;
  side: string;
  symbol: string;
  volume: number;
};
