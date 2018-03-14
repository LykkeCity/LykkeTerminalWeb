import {computed, observable, runInAction} from 'mobx';
import {compose, map, sortBy} from 'rambda';
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
    const sortedWatchlistNames = compose<
      WatchlistModel[],
      WatchlistModel[],
      string[]
    >(map(w => w.name), sortBy(w => w.order));
    return sortedWatchlistNames(this.watchlists);
  }

  @observable
  private watchlists: any[] = defaultWatchLists.map(mappers.mapToWatchList);

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
    return this.watchlists.find((wl: WatchlistModel) => wl.name === name);
  };

  reset = () => {
    this.watchlists = defaultWatchLists.map(mappers.mapToWatchList);
  };
}

export default WatchlistStore;
