import {computed, observable, runInAction} from 'mobx';
import {AssetsApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class AssetStore extends BaseStore {
  @computed
  get allAssets() {
    return this.assets;
  }

  get baseAssetId() {
    return this.baseAsset;
  }

  @observable private assets: any[] = [];
  @observable private baseAsset: string = '';
  private parentStore: RootStore;

  constructor(store: RootStore, private readonly api: AssetsApi) {
    super(store);
    this.parentStore = store;
  }

  createAssetsList = ({DisplayId, Id, Name}: any) => ({
    displayId: DisplayId || Name,
    id: Id
  });

  fetchAll = async () => {
    const assetsListDto = await this.api.fetchAll();

    runInAction(() => {
      this.assets = assetsListDto.Assets.map(this.createAssetsList);
    });
  };

  fetchBaseAsset = async () => {
    this.baseAsset = await this.api
      .fetchBaseAsset()
      .then((res: any) => res.BaseAssetId);
    return Promise.resolve();
  };

  setBaseAssetId = (assetId: string) => {
    localStorage.setItem('baseAsset', assetId);
    this.baseAsset = assetId;
    this.api.setBaseAsset({BaseAsssetId: assetId});
    this.parentStore.balanceListStore.updateBalance();
  };

  reset = () => {
    this.assets = [];
  };
}

export default AssetStore;
