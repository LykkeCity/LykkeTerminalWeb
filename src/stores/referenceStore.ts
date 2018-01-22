import {action, computed, observable, runInAction} from 'mobx';
import {AssetApi} from '../api/index';
import keys from '../constants/storageKeys';
import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel,
  SearchString
} from '../models';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const baseAssetStorage = StorageUtils(keys.baseAsset);
const withIdAndName = (x: InstrumentModel) => !!x.id && !!x.name;

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

  findInstruments = (term: string) => {
    return this.instruments.filter(withIdAndName).filter(x =>
      x.name
        .toLowerCase()
        .replace(SearchString.Delimiter, SearchString.Empty)
        .includes(
          term.toLowerCase().replace(SearchString.Delimiter, SearchString.Empty)
        )
    );
  };

  fetchReferenceData = async () => {
    await this.fetchBaseAsset();
    await this.fetchCategories();
    await this.fetchAssets();
  };

  fetchAssets = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        if (resp && resp.Assets) {
          runInAction(() => {
            this.assets = resp.Assets.map(this.mapAssetFromDto);
          });
        }
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  fetchCategories = () => {
    return this.api
      .fetchAssetCategories()
      .then((resp: any) => {
        if (resp && resp.AssetCategories) {
          runInAction(() => {
            this.categories = resp.AssetCategories.map(this.mapCategoryFromDto);
          });
        }
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  fetchInstruments = async () => {
    const resp = await this.api.fetchAssetInstruments();
    if (resp && resp.AssetPairs) {
      runInAction(() => {
        this.instruments = resp.AssetPairs.map(this.mapInstrumentFromDto);
      });
    }
  };

  fetchBaseAsset = () => {
    return this.api
      .fetchBaseAsset()
      .then((res: any) => {
        if (res && res.BaseAssetId) {
          this.baseAsset = res.BaseAssetId;
          baseAssetStorage.set(this.baseAsset);
        }
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  setBaseAssetId = async (assetId: string) => {
    baseAssetStorage.set(assetId);
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
