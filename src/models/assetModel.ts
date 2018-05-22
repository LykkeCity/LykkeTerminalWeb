import {extendObservable} from 'mobx';
import {AssetCategoryModel} from './index';

class AssetModel {
  id: string;
  name: string;
  category: AssetCategoryModel;
  accuracy: number;

  canBeBase?: boolean = false;
  iconUrl?: string = '';

  constructor(asset: Partial<AssetModel>) {
    extendObservable(this, asset);
  }
}

export default AssetModel;
