import {action, computed, extendObservable, observable} from 'mobx';
import {join} from 'rambda';
import {Dir} from '../models';
import {AssetModel} from './index';

class InstrumentModel {
  id: string;
  name: string;
  baseAsset: AssetModel;
  quoteAsset: AssetModel;
  accuracy: number;
  invertedAccuracy: number;

  @observable price: number;
  @observable bid: number;
  @observable ask: number;
  @observable change: number;

  @observable dir: Dir;

  @computed
  get displayName() {
    if (this.baseAsset && this.quoteAsset) {
      return join('/', [this.baseAsset.name, this.quoteAsset.name]);
    }
    return undefined;
  }

  constructor(instrument: Partial<InstrumentModel>) {
    extendObservable(this, instrument);
  }

  @action
  updatePrice = (nextPrice: number) => {
    if (this.price !== nextPrice) {
      this.change = (nextPrice - this.price) / this.price * 100;
      this.dir = this.change > 0 ? Dir.Up : Dir.Down;
      this.price = nextPrice;
    }
  };

  @action
  updateBid = (nextPrice: number) => {
    this.bid = nextPrice;
  };

  @action
  updateAsk = (nextPrice: number) => {
    this.ask = nextPrice;
  };
}

export default InstrumentModel;
