import {observable} from 'mobx';
import {AssetCategoryModel} from './index';

class AssetModel {
  id: string;
  category: AssetCategoryModel;
  accuracy: number;

  canBeBase?: boolean = false;
  iconUrl?: string = '';
  fullName?: string = '';

  @observable name: string;

  constructor(asset: Partial<AssetModel>) {
    Object.assign(this, asset);
  }
}

export default AssetModel;
