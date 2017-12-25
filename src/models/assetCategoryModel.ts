import {extendObservable} from 'mobx';

class AssetCategoryModel {
  static Other = () => new AssetCategoryModel({name: 'Other'});

  id: string;
  name: string;

  constructor(category: Partial<AssetCategoryModel>) {
    extendObservable(this, category);
  }
}

export default AssetCategoryModel;
