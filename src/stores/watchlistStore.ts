import {computed, observable, runInAction} from 'mobx';
import {compose, find, map, reject, sortBy} from 'rambda';
import {WatchlistApi} from '../api/index';
import {InstrumentModel, keys} from '../models';
import * as mappers from '../models/mappers';
import WatchlistModel from '../models/watchlistModel';
import Watchlists from '../models/watchlists';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const watchlistsStorage = StorageUtils(keys.watchlists);

class WatchlistStore extends BaseStore {
  @observable private watchlists: WatchlistModel[] = [];

  @computed
  get allInstrumentsWatchlist() {
    const instruments =
      (this.getInstruments && this.getInstruments()) ||
      this.rootStore.referenceStore.getInstruments();
    return new WatchlistModel({
      name: Watchlists.All,
      assetPairIds: instruments.map(i => i.id),
      readOnly: true
    });
  }

  @computed
  get activeWatchlists() {
    return [
      this.allInstrumentsWatchlist,
      ...reject(w => w.name === Watchlists.All, this.watchlists)
    ];
  }

  @computed
  get watchlistNames() {
    return compose(
      map((w: WatchlistModel) => w.name),
      sortBy(w => w.order)
    )(this.activeWatchlists);
  }

  constructor(
    store: RootStore,
    private readonly api: WatchlistApi,
    private readonly getInstruments?: () => InstrumentModel[]
  ) {
    super(store);
  }

  getWatchlistByName = (name: string) =>
    find(watchlist => watchlist.name === name, this.activeWatchlists);

  fetchAll = async () => {
    try {
      const resp = await this.api.fetchAll(this.fetchAll);
      runInAction(() => {
        this.watchlists = resp.map(mappers.mapToWatchlist);
        watchlistsStorage.set(JSON.stringify(this.watchlists));
      });
    } catch {
      if (this.rootStore.apiStore.getUseCacheData()) {
        this.watchlists = JSON.parse(watchlistsStorage.get()!);
      }
    }
  };

  reset = () => {
    this.watchlists = [];
  };
}

export default WatchlistStore;
