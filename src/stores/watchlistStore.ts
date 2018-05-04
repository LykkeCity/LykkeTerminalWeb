import {computed, observable, runInAction} from 'mobx';
import {compose, find, map, reject, sortBy} from 'rambda';
import {WatchlistApi} from '../api/index';
import {InstrumentModel} from '../models';
import * as mappers from '../models/mappers';
import WatchlistModel from '../models/watchlistModel';
import Watchlists from '../models/watchlists';
import {BaseStore, RootStore} from './index';

class WatchlistStore extends BaseStore {
  @observable private watchlists: WatchlistModel[] = [];

  @computed
  get allInstrumentsWatchlist() {
    const instruments =
      (this.getInstruments && this.getInstruments()) ||
      this.rootStore.referenceStore.getInstruments();
    return new WatchlistModel({
      name: Watchlists.All,
      assetIds: instruments.map(i => i.id),
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
    return compose(map((w: WatchlistModel) => w.name), sortBy(w => w.order))(
      this.activeWatchlists
    );
  }

  constructor(
    store: RootStore,
    private readonly api: WatchlistApi,
    private readonly getInstruments?: () => InstrumentModel[]
  ) {
    super(store);
  }

  getWatchlistById = (id: string) => find(x => x.id === id, this.watchlists);

  getWatchlistByName = (name: string) =>
    find(watchlist => watchlist.name === name, this.activeWatchlists);

  addWatchlist = (watchlist: WatchlistModel) => this.watchlists.push(watchlist);

  fetchAll = async () => {
    const resp = await this.api.fetchAll();
    runInAction(() => {
      this.watchlists = resp.map(mappers.mapToWatchlist);
    });
  };

  reset = () => {
    this.watchlists = [];
  };
}

export default WatchlistStore;
