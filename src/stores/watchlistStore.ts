import {computed, observable, runInAction} from 'mobx';
import {WatchlistApi} from '../api/index';
import defaultWatchLists from '../constants/watchlists';
import * as mappers from '../models/mappers';
import WatchlistModel from '../models/watchlistModel';
import {BaseStore, RootStore} from './index';

class WatchlistStore extends BaseStore {
  @computed
  get defaultWatchlist() {
    return this.watchlists[0];
  }

  @computed
  get activeWatchlists() {
    return this.watchlists;
  }

  @computed
  get watchlistNames() {
    return this.watchlists
      .filter((watchlist: WatchlistModel) => watchlist.readOnly)
      .map((wl: WatchlistModel) => wl.name);
  }

  @observable
  private watchlists: any[] = defaultWatchLists.map(mappers.mapToWatchList); // TODO find a way to load watchlists for unauthorized users

  constructor(store: RootStore, private readonly api: WatchlistApi) {
    super(store);
  }

  getWatchlistById = (id: string) => this.watchlists.find(x => x.id === id);

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        runInAction(() => {
          this.watchlists = resp.map(mappers.mapToWatchList);
        });
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  watchlistsByName = (name: string) => {
    return this.watchlists.filter((wl: WatchlistModel) => wl.name === name)[0];
  };

  reset = () => {
    this.watchlists = defaultWatchLists.map(mappers.mapToWatchList);
  };
}

export default WatchlistStore;
