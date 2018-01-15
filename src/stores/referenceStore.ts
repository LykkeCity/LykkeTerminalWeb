import {action, computed, observable, runInAction} from 'mobx';
import {AssetApi} from '../api/index';
import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel,
  SearchString
} from '../models';
import {BaseStore, RootStore} from './index';

class ReferenceStore extends BaseStore {
  @observable private assets: AssetModel[] = [];
  @observable private categories: AssetCategoryModel[] = [];
  @observable private instruments: InstrumentModel[] = [];
  @observable private baseAsset: string = '';

  @computed
  get baseAssets() {
    return this.assets.filter(x => x.isBase);
  }

  @computed
  get allAssets() {
    return this.assets;
  }

  @computed
  get baseAssetId() {
    return this.baseAsset;
  }

  @computed
  get getBaseAssetAccuracy() {
    const asset = this.getAssetById(this.baseAsset);
    return asset ? asset.accuracy : 2;
  }

  constructor(readonly store: RootStore, private api: AssetApi) {
    super(store);
  }

  getAssets = () => this.assets;

  getAssetById = (id: string) => this.assets.find(a => a.id === id);

  @action
  addAsset = (asset: AssetModel) => (this.assets = [...this.assets, asset]);

  getCategories = () => this.categories;

  getInstruments = () => {
    // TODO: should be implemented properly
    if (this.rootStore.watchlistStore) {
      const allowedInstruments = this.rootStore.watchlistStore.defaultWatchlist
        .assetIds;
      return this.instruments.filter(
        (x: InstrumentModel) => allowedInstruments.indexOf(x.id) > -1
      );
    }
    return this.instruments;
  };

  getInstrumentById = (id: string) =>
    this.instruments.find(x => x.id.toLowerCase().includes(id.toLowerCase()));

  findInstruments = (term: string) =>
    this.instruments.filter(x =>
      x.name
        .toLowerCase()
        .replace(SearchString.Delimiter, SearchString.Empty)
        .includes(
          term.toLowerCase().replace(SearchString.Delimiter, SearchString.Empty)
        )
    );

  fetchReferenceData = async () => {
    await this.fetchBaseAsset();
    await this.fetchCategories();
    await this.fetchAssets();
    await this.fetchInstruments();
  };

  fetchAssets = async () => {
    const resp = await this.api.fetchAll();
    if (resp && resp.Assets) {
      runInAction(() => {
        this.assets = resp.Assets.map(this.mapAssetFromDto);
      });
    }
  };

  fetchCategories = async () => {
    const resp = await this.api.fetchAssetCategories();
    if (resp && resp.AssetCategories) {
      runInAction(() => {
        this.categories = resp.AssetCategories.map(this.mapCategoryFromDto);
      });
    }
  };

  fetchInstruments = async () => {
    const resp = await this.api.fetchAssetInstruments();
    if (resp && resp.AssetPairs) {
      runInAction(() => {
        this.instruments = resp.AssetPairs.map(this.mapInstrumentFromDto);
      });
    }
  };

  fetchBaseAsset = async () => {
    const res = await this.api.fetchBaseAsset();

    if (res && res.BaseAssetId) {
      this.baseAsset = res.BaseAssetId;
    }
  };

  setBaseAssetId = async (assetId: string) => {
    localStorage.setItem('baseAsset', assetId);
    this.baseAsset = assetId;
    this.api.setBaseAsset({BaseAsssetId: assetId});
    this.rootStore.balanceListStore.updateBalance();
  };

  reset = () => (this.assets = []);

  private mapAssetFromDto = ({
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
        this.categories.find(x => x.id === CategoryId) ||
        AssetCategoryModel.Other(),
      iconUrl: IconUrl,
      id: Id,
      isBase: IsBase,
      name: DisplayId || Name
    });

  private mapCategoryFromDto = ({Id: id, Name: name}: any) =>
    new AssetCategoryModel({id, name});

  private mapInstrumentFromDto = ({
    Id,
    Accuracy,
    BaseAssetId,
    IsDisabled,
    InvertedAccuracy,
    Name,
    QuotingAssetId,
    Source,
    Source2
  }: any) =>
    new InstrumentModel({
      id: Id,
      name: Name,
      // tslint:disable-next-line:object-literal-sort-keys
      baseAsset: this.getAssetById(BaseAssetId),
      quotingAsset: this.getAssetById(QuotingAssetId),
      accuracy: Accuracy,
      invertedAccuracy: InvertedAccuracy
    });
}

export default ReferenceStore;
