import {extendObservable} from 'mobx';
import {AssetModel} from './index';

class InstrumentModel {
  id: string;
  name: string;
  baseAsset: AssetModel;
  quotingAsset: AssetModel;
  accuracy: number;
  invertedAccuracy: number;

  constructor(instrument: Partial<InstrumentModel>) {
    extendObservable(this, instrument);
  }
}

export default InstrumentModel;
