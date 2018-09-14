import {action, computed, observable, runInAction} from 'mobx';
import {compose, filter, replace, toLower} from 'rambda';
import {AssetApi} from '../api/index';
import {keys} from '../models';
import {
  AssetModel,
  DescriptionResponseModel,
  InstrumentModel,
  SearchString
} from '../models';
import AssetResponseModel from '../models/assetResponseModel';
import * as mappers from '../models/mappers';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

// tslint:disable-next-line:no-var-requires
const {includes} = require('rambda');

const normalize = compose(
  replace(SearchString.Delimiter, SearchString.Empty),
  toLower
);

const assetsStorage = StorageUtils(keys.assets);
const availableAssetsStorage = StorageUtils(keys.availableAssets);
const baseAssetStorage = StorageUtils(keys.baseAsset);
const descriptionsStorage = StorageUtils(keys.descriptions);
const instrumentsStorage = StorageUtils(keys.instruments);

class ReferenceStore extends BaseStore {
  descriptions: DescriptionResponseModel[];

  @observable assets: AssetModel[] = [];
  @observable.shallow private availableAssets: string[] = [];
  @observable.shallow private instruments: InstrumentModel[] = [];
  @observable private baseAsset: string = '';

  @computed
  get baseAssets() {
    return this.assets
      .filter(a => this.availableAssets.indexOf(a.id) > -1)
      .filter(a => a.canBeBase);
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
  addAsset = (asset: AssetModel) => {
    this.assets = [...this.assets, asset];
    assetsStorage.set(JSON.stringify(this.assets));
  };

  getInstruments = () => {
    return this.instruments;
  };

  getInstrumentById = (id: string) => this.instruments.find(x => x.id === id);

  findInstruments = (term: string, watchlistName: string) => {
    const {getWatchlistByName} = this.rootStore.watchlistStore;
    const normalizedTerm = normalize(term);
    const instrumentsByName = this.instruments.filter(
      instrument =>
        includes(normalizedTerm, normalize(instrument.displayName!)) ||
        includes(normalizedTerm, normalize(instrument.invertedDisplayName!)) ||
        includes(normalizedTerm, normalize(instrument.baseAsset.fullName!))
    );

    if (watchlistName) {
      const instrumentsByWatchlist = getWatchlistByName(watchlistName);
      if (instrumentsByWatchlist) {
        return filter(
          i => instrumentsByWatchlist.assetPairIds.indexOf(i.id) > -1,
          instrumentsByName
        );
      }
    }
    return instrumentsByName;
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
    await this.fetchAssets();

    if (!this.rootStore.authStore.isAuth) {
      await this.fetchPublicInstruments();
    } else {
      await this.fetchInstruments();
      await this.fetchAvailableAssets();
    }
  };

  findAppropriateDescriptionById = (
    descriptions: DescriptionResponseModel[],
    assetId: string
  ): DescriptionResponseModel => {
    return (
      descriptions.find(
        (rawDescription: DescriptionResponseModel) =>
          rawDescription.Id === assetId
      ) || ({} as DescriptionResponseModel)
    );
  };

  @action
  fetchAssets = () => {
    const requests = [
      this.api.fetchAll(this.fetchAssets),
      this.api.fetchAssetsDescriptions(this.fetchAssets)
    ];

    return Promise.all(requests)
      .then(data => {
        // TODO: Remove variability when new endpoint releases
        const assets = data[0].Assets || data[0];
        this.descriptions = data[1].Descriptions || data[1];
        if (assets.length > 0) {
          runInAction(() => {
            this.assets = assets.map((rawAsset: AssetResponseModel) => {
              const appropriateDescription = this.findAppropriateDescriptionById(
                this.descriptions,
                rawAsset.Id
              );
              return mappers.mapToAsset(rawAsset, appropriateDescription);
            });
            assetsStorage.set(JSON.stringify(this.assets));
            descriptionsStorage.set(JSON.stringify(this.descriptions));
          });
        }
        return Promise.resolve();
      })
      .catch(() => {
        if (this.rootStore.apiStore.getUseCacheData()) {
          this.assets = JSON.parse(assetsStorage.get()!) || [];
          this.descriptions = JSON.parse(descriptionsStorage.get()!) || [];
        }
      });
  };

  fetchAssetById = (id: string) => {
    return this.api
      .fetchAssetById(id, () => this.fetchAssetById(id))
      .then((data: any) => {
        let mappedAsset;
        const rawAsset = data.Asset || data;
        if (rawAsset) {
          const appropriateDescription = this.findAppropriateDescriptionById(
            this.descriptions,
            rawAsset.Id
          );
          mappedAsset = mappers.mapToAsset(
            rawAsset as AssetResponseModel,
            appropriateDescription as DescriptionResponseModel
          );
          this.assets.push(mappedAsset);
          assetsStorage.set(JSON.stringify(this.assets));
        }
        return Promise.resolve(mappedAsset);
      });
  };

  fetchAvailableAssets = async () => {
    try {
      const resp = await this.api.fetchAvailableAssets(
        this.fetchAvailableAssets
      );
      runInAction(() => {
        this.availableAssets = resp.AssetIds;
        availableAssetsStorage.set(JSON.stringify(this.availableAssets));
      });
    } catch {
      if (this.rootStore.apiStore.getUseCacheData()) {
        this.availableAssets = JSON.parse(availableAssetsStorage.get()!);
      }
    }
  };

  fetchInstruments = async () => {
    try {
      const resp = await this.api.fetchAssetInstruments(this.fetchInstruments);
      if (resp) {
        const assetPairs = resp.AssetPairs || resp;
        if (!assetPairs) {
          return;
        }
        runInAction(() => {
          this.instruments = assetPairs.map((x: any) =>
            mappers.mapToInstrument(x, this.getAssetById)
          );
          instrumentsStorage.set(JSON.stringify(this.instruments));
        });
      }
    } catch {
      if (this.rootStore.apiStore.getUseCacheData()) {
        this.setInstrumentsFromCache();
      }
    }
  };

  fetchPublicInstruments = async () => {
    try {
      const resp = await this.api.fetchPublicAssetInstruments(
        this.fetchPublicInstruments
      );
      if (resp) {
        const assetPairs = resp.AssetPairs || resp;
        if (!assetPairs) {
          return;
        }
        runInAction(() => {
          this.instruments = assetPairs.map((x: any) =>
            mappers.mapToPublicInstrument(x, this.getAssetById)
          );
          instrumentsStorage.set(JSON.stringify(this.instruments));
        });
      }
    } catch {
      if (this.rootStore.apiStore.getUseCacheData()) {
        this.setInstrumentsFromCache();
      }
    }
  };

  fetchBaseAsset = () => {
    return this.api
      .fetchBaseAsset(this.fetchBaseAsset)
      .then((res: any) => {
        if (!!res) {
          this.baseAsset = res.BaseAssetId || 'USD';
          baseAssetStorage.set(this.baseAsset);
        }
        return Promise.resolve();
      })
      .catch(() => {
        if (this.rootStore.apiStore.getUseCacheData()) {
          this.baseAsset = baseAssetStorage.get()!;
        }
      });
  };

  fetchRates = async () => {
    try {
      const resp = await this.api.fetchMarket(this.fetchRates);
      resp.forEach(
        ({AssetPair, Volume24H, PriceChange24H, Bid, Ask, LastPrice}: any) => {
          const instrument = this.getInstrumentById(AssetPair);
          if (instrument) {
            runInAction(() => {
              instrument.price = LastPrice;
              instrument.bid = Bid;
              instrument.ask = Ask;
              instrument.volume = Volume24H;
              instrument.change24h = PriceChange24H * 100;
            });
          }
        }
      );
      instrumentsStorage.set(JSON.stringify(this.instruments));
    } catch {
      if (this.rootStore.apiStore.getUseCacheData()) {
        this.setInstrumentsFromCache();
      }
    }
  };

  setBaseAssetId = async (assetId: string) => {
    baseAssetStorage.set(assetId);
    this.baseAsset = assetId;
    this.api.setBaseAsset({BaseAsssetId: assetId});
    this.updateInstruments();
    this.rootStore.balanceListStore.updateWalletBalances();
  };

  updateInstruments = () => {
    this.getInstruments().forEach(instrument =>
      instrument.updateVolumeInBase(
        this.rootStore.marketStore.convert(
          instrument.volume,
          instrument.baseAsset.id,
          this.baseAssetId,
          this.getInstrumentById
        )
      )
    );
    instrumentsStorage.set(JSON.stringify(this.instruments));
  };

  onQuote = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.getInstrumentById(id);
    if (instrument && instrument.id) {
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
        this.rootStore.marketStore.convert(
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

  private setInstrumentsFromCache = () => {
    this.instruments = (JSON.parse(instrumentsStorage.get()!) || []).map(
      (instrument: any) => new InstrumentModel(instrument)
    );
  };
}

export default ReferenceStore;
