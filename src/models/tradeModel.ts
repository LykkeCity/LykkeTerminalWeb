import {extendObservable} from 'mobx';

class TradeModel {
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  timestamp: string;
  tradeId: number;

  constructor(trade: Partial<TradeModel>) {
    extendObservable(this, trade);
  }
}

export default TradeModel;
