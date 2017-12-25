import {action, computed, observable, runInAction} from 'mobx';
import {RestApi} from '../api/index';
import {AssetCategory, AssetModel} from '../models/index';
import {BaseStore, RootStore} from './index';

class AssetStore extends BaseStore {
  @observable private assets: AssetModel[] = [];
  @observable private categories: any[] = [];

  @computed
  get baseAssets() {
    return this.assets.filter(x => x.isBase);
  }

  constructor(readonly store: RootStore, private api: RestApi) {
    super(store);
  }

  getAssets = () => this.assets;

  getAssetById = (id: string) => this.assets.find(a => a.id === id);

  @action
  addAsset = (asset: AssetModel) => (this.assets = [...this.assets, asset]);

  getCategories = () => this.categories;

  fetchAssets = async () => {
    const resp = await this.api.get('/assets');
    if (resp && resp.Assets) {
      runInAction(() => {
        this.assets = resp.Assets.map(this.mapFromDto);
      });
    }
  };

  fetchCategories = async () => {
    const resp = await this.api.get('/assets/categories');
    if (resp && resp.AssetCategories) {
      runInAction(() => {
        this.categories = resp.AssetCategories.map(
          ({Id: id, Name: name}: any) => new AssetCategory({id, name})
        );
      });
    }
  };

  reset = () => (this.assets = []);

  private mapFromDto = ({
    Id,
    Name,
    DisplayId,
    CategoryId,
    Accuracy,
    IsBase,
    IconUrl
  }: any) =>
    new AssetModel({
      accuracy: Accuracy,
      category:
        this.categories.find(x => x.id === CategoryId) || AssetCategory.Other(),
      iconUrl: IconUrl,
      id: Id,
      isBase: IsBase,
      name: DisplayId || Name
    });
}

export default AssetStore;
