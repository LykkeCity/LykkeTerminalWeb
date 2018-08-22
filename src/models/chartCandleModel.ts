import {extendObservable} from 'mobx';

class ChartCandleModel {
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  date: any;
  absoluteChange?: number;
  percentChange?: number;
  dividend?: string;
  split?: string;

  constructor(candle: Partial<ChartCandleModel>) {
    extendObservable(this, candle);
  }
}

export default ChartCandleModel;
