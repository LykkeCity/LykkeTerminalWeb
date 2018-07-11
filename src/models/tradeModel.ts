import {InstrumentModel, OrderType} from './index';

class TradeModel {
  id: string;
  asset: string;
  side: string;
  volume: number;
  timestamp: string;
  tradeId: string;
  symbol: string;
  price: number;
  oppositeVolume: number;
  orderType: OrderType;
  fee: number;
  instrument?: InstrumentModel;
  index?: number;
  walletId?: string;

  constructor(trade: Partial<TradeModel>) {
    Object.assign(this, trade);
  }
}

export default TradeModel;
