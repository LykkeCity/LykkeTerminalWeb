import {extendObservable} from 'mobx';

class TradeModel {
  asset: string;
  side: string;
  quantity: number;
  price: number;
  timestamp: string;
  tradeId: string;

  constructor(trade: Partial<TradeModel>) {
    extendObservable(this, trade);
  }
}

export default TradeModel;
