export default interface TradeListItemInterface {
  id: number;
  side: string;
  symbol: string;
  quantity: number;
  timestamp: Date;
  price: number;
};
