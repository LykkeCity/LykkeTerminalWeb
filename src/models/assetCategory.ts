import {extendObservable} from 'mobx';

class AssetCategory {
  static Other = () => new AssetCategory({name: 'Other'});

  id: string;
  name: string;

  constructor(category: Partial<AssetCategory>) {
    extendObservable(this, category);
  }
}

export default AssetCategory;
