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
import MarketService from '../services/marketService';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const baseAssetStorage = StorageUtils(keys.baseAsset);

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
    return watchlistStore
      ? this.instruments
          .filter(
            i => watchlistStore.defaultWatchlist.assetIds.indexOf(i.id) > -1
          )
          .filter(this.filterAvailableInstrument)
      : this.instruments;
  };

  getInstrumentById = (id: string) =>
    this.instruments.find(x => x.id.toLowerCase().includes(id.toLowerCase()));

  findInstruments = (term: string, name: string) => {
    const isAuth = this.rootStore.authStore.isAuth;
    const instruments = isAuth
      ? this.instruments
          .filter(i => i.baseAsset && i.quoteAsset)
          .filter(this.filterAvailableInstrument)
      : this.instruments;

    return instruments
      .filter(this.filterWithIdAndName)
      .filter(x =>
        x.displayName!
          .toLowerCase()
          .replace(SearchString.Delimiter, SearchString.Empty)
          .includes(
            term
              .toLowerCase()
              .replace(SearchString.Delimiter, SearchString.Empty)
          )
      )
      .filter(
        i =>
          isAuth
            ? !!~this.rootStore.watchlistStore
                .watchlistsByName(name)
                .assetIds.indexOf(i.id)
            : i
      );
  };

  @action
  addInstrument = (instrument: InstrumentModel) => {
    this.instruments.push(instrument);
  };

  @action
  addAvailableAsset = (assetId: string) => {
    this.availableAssets.push(assetId);
  };

  fetchReferenceData = async () => {
    await this.fetchCategories();
    await this.fetchAssets();

    if (!this.rootStore.authStore.isAuth) {
      await this.fetchPublicInstruments();
    } else {
      await this.fetchInstruments();
      await this.fetchAvailableAssets();
    }
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

  fetchAssetById = (id: string) => {
    return this.api.fetchAssetById(id).then((resp: any) => {
      const asset = mappers.mapToAsset(resp.Asset, this.categories);
      this.assets.push(asset);
      return Promise.resolve(asset);
    });
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

  fetchPublicInstruments = async () => {
    const resp = await this.api.fetchPublicAssetInstruments();
    if (resp && resp.AssetPairs) {
      runInAction(() => {
        this.instruments = resp.AssetPairs.map((x: any) =>
          mappers.mapToPublicInstrument(x, this.getAssetById)
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

  fetchRates = async () => {
    const resp = await this.api.fetchRates();
    resp.AssetPairRates.forEach(({AssetPair, BidPrice, AskPrice}: any) => {
      const instrument = this.getInstrumentById(AssetPair);
      if (instrument) {
        instrument.price = BidPrice;
        instrument.bid = BidPrice;
        instrument.ask = AskPrice;
      }
    });
  };

  setBaseAssetId = async (assetId: string) => {
    baseAssetStorage.set(assetId);
    this.baseAsset = assetId;
    this.api.setBaseAsset({BaseAsssetId: assetId});
    this.updateInstruments();
    const {
      updateBalance,
      updateTradingWallet
    } = this.rootStore.balanceListStore;
    updateBalance();
    updateTradingWallet();
  };

  updateInstruments = () => {
    this.getInstruments().forEach(instrument =>
      instrument.updateVolumeInBase(
        MarketService.convert(
          instrument.volume,
          instrument.baseAsset.id,
          this.baseAssetId,
          this.getInstrumentById
        )
      )
    );
  };

  onQuote = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.getInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updatePrice(price);
      instrument.updateBid(price); // TODO: improve domain model design
    }
  };

  onQuoteAsk = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.getInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updateAsk(price);
    }
  };

  onCandle = async (args: any) => {
    const {a: id, o: openPrice, c: closePrice, v: volume} = args[0];
    const instrument = this.getInstrumentById(id);

    if (instrument && instrument.id) {
      instrument.updateFromCandle(openPrice, closePrice, volume);
      instrument.updateVolumeInBase(
        MarketService.convert(
          volume,
          instrument.baseAsset.id,
          this.baseAssetId,
          this.getInstrumentById
        )
      );
    }
  };

  reset = () => {
    this.assets = [];
    this.availableAssets = [];
  };

  private filterAvailableInstrument = (i: InstrumentModel) =>
    this.availableAssets.indexOf(i.baseAsset.id) > -1 &&
    this.availableAssets.indexOf(i.quoteAsset.id) > -1;

  private filterWithIdAndName = (i: InstrumentModel) =>
    i.id && i.name && i.displayName;
}

export default ReferenceStore;
