import TradeListSide from '../../stores/enums/tradelistSide';

export default interface TradeListItemProps {
  id: number;
  quantity: number;
  side: TradeListSide;
  symbol: string;
  price: string;
  timestamp: Date;
};
