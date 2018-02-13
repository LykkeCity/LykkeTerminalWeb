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
  @observable private categories: AssetCategoryModel[] = [];
  @observable.shallow private instruments: InstrumentModel[] = [];
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

  findInstruments = (term: string, name: string) => {
    return this.instruments
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
}

export default ReferenceStore;
