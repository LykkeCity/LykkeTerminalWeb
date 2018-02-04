import {extendObservable} from 'mobx';

class TradeModel {
  id: string;
  asset: string;
  side: string;
  quantity: number;
  timestamp: string;
  tradeId: string;

  constructor(trade: Partial<TradeModel>) {
    extendObservable(this, trade);
  }
}

export default TradeModel;
