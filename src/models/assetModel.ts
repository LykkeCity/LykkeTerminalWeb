import {extendObservable} from 'mobx';
import {AssetCategoryModel} from './index';

class AssetModel {
  id: string;
  name: string;
  category: AssetCategoryModel;
  accuracy: number;

  isBase?: boolean = false;
  iconUrl?: string = '';
  fullName?: string = '';

  constructor(asset: Partial<AssetModel>) {
    extendObservable(this, asset);
  }
}

export default AssetModel;
