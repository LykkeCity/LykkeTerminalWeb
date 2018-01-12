import {extendObservable} from 'mobx';

class TradeListModel {
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  timestamp: string;

  constructor(tradeList: Partial<TradeListModel>) {
    extendObservable(this, tradeList);
  }
}

export default TradeListModel;
