import {extendObservable} from 'mobx';
import {AssetCategory} from './index';

class AssetModel {
  id: string;
  name: string;
  category: AssetCategory;
  accuracy: number;

  isBase?: boolean = false;
  iconUrl?: string = '';

  constructor(asset: Partial<AssetModel>) {
    extendObservable(this, asset);
  }
}

export default AssetModel;
