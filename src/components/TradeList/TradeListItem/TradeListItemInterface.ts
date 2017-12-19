import Side from '../../../stores/enums/side';

export default interface TradeListItemInterface {
  id: number;
  quantity: number;
  side: Side;
  symbol: string;
  price: string;
  timestamp: Date;
};
