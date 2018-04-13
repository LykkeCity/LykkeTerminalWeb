import {action, computed, extendObservable, observable} from 'mobx';
import {join} from 'rambda';
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
  @observable volumeInBase: number = 0;
  @observable change24h: number = 0;
  @observable volume: number = 0;

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

  @action
  updateVolumeInBase = (nextVolumeInBase: number) => {
    if (this.volumeInBase !== nextVolumeInBase) {
      this.volumeInBase = nextVolumeInBase;
    }
  };

  @action
  updateFromCandle = (
    openPrice: number,
    closePrice: number,
    volume: number
  ) => {
    this.change24h = (closePrice - openPrice) / openPrice * 100;
    this.volume = volume;
  };
}

export default InstrumentModel;
