import {action, computed, observable, runInAction} from 'mobx';
import {AssetApi} from '../api/index';
import keys from '../constants/storageKeys';
import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel,
  SearchString
} from '../models';
import * as mappers from '../models/mappers';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const baseAssetStorage = StorageUtils(keys.baseAsset);
const withIdAndName = (x: InstrumentModel) => !!x.id && !!x.name;

// tslint:disable:no-bitwise
class ReferenceStore extends BaseStore {
  @observable private assets: AssetModel[] = [];
  @observable.shallow private availableAssets: string[] = [];
  @observable private categories: AssetCategoryModel[] = [];
  @observable.shallow private instruments: InstrumentModel[] = [];
  @observable private baseAsset: string = '';

  @computed
  get baseAssets() {
    return this.assets
      .filter(a => this.availableAssets.indexOf(a.id) > -1)
      .filter(a => a.isBase);
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

  @computed
  get getBaseAsset() {
    return this.getAssetById(this.baseAssetId);
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
    const {watchlistStore} = this.rootStore;
    // TODO: should be implemented properly
    if (watchlistStore) {
      const allowedInstruments = watchlistStore.defaultWatchlist.assetIds;
      return this.instruments
        .filter(x => allowedInstruments.indexOf(x.id) > -1)
        .filter(this.filterAvailableInstrument);
    }
    return this.instruments;
  };

  getInstrumentById = (id: string) =>
    this.instruments.find(x => x.id.toLowerCase().includes(id.toLowerCase()));

  findInstruments = (term: string, name: string) => {
    return this.instruments
      .filter(i => i.baseAsset && i.quotingAsset)
      .filter(this.filterAvailableInstrument)
      .filter(withIdAndName)
      .filter(x =>
        x.name
          .toLowerCase()
          .replace(SearchString.Delimiter, SearchString.Empty)
          .includes(
            term
              .toLowerCase()
              .replace(SearchString.Delimiter, SearchString.Empty)
          )
      )
      .filter(
        (instrument: InstrumentModel) =>
          !!~this.rootStore.watchlistStore
            .watchlistsByName(name)
            .assetIds.indexOf(instrument.id)
      );
  };

  fetchReferenceData = async () => {
    await this.fetchCategories();
    await this.fetchAssets();
    await this.fetchInstruments();
    await this.fetchAvailableAssets();
  };

  fetchAssets = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        if (resp && resp.Assets) {
          runInAction(() => {
            this.assets = resp.Assets.map((x: any) =>
              mappers.mapToAsset(x, this.categories)
            );
          });
        }
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  fetchAvailableAssets = async () => {
    const resp = await this.api.fetchAvailableAssets();
    runInAction(() => {
      this.availableAssets = resp.AssetIds;
    });
  };

  fetchCategories = () => {
    return this.api
      .fetchAssetCategories()
      .then((resp: any) => {
        if (resp && resp.AssetCategories) {
          runInAction(() => {
            this.categories = resp.AssetCategories.map(
              mappers.mapToAssetCategory
            );
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
        this.instruments = resp.AssetPairs.map((x: any) =>
          mappers.mapToInstrument(x, this.getAssetById)
        );
      });
    }
  };

  fetchBaseAsset = () => {
    return this.api
      .fetchBaseAsset()
      .then((res: any) => {
        if (!!res) {
          this.baseAsset = res.BaseAssetId || 'USD';
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
    const {
      updateBalance,
      updateTradingWallet
    } = this.rootStore.balanceListStore;
    updateBalance();
    updateTradingWallet();
  };

  onQuote = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.getInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updatePrice(price);
    }
  };

  reset = () => (this.assets = []);

  private filterAvailableInstrument = (i: InstrumentModel) =>
    this.availableAssets.indexOf(i.baseAsset.id) > -1 &&
    this.availableAssets.indexOf(i.quotingAsset.id) > -1;
}

export default ReferenceStore;
