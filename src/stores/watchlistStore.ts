import {computed, observable, runInAction} from 'mobx';
import {WatchlistApi} from '../api/index';
import defaultWatchLists from '../constants/watchlists';
import * as mappers from '../models/mappers';
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

  @observable
  private watchlists: any[] = defaultWatchLists.map(mappers.mapToWatchList);

  constructor(store: RootStore, private readonly api: WatchlistApi) {
    super(store);
  }

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

  reset = () => {
    this.watchlists = defaultWatchLists.map(mappers.mapToWatchList);
  };
}

export default WatchlistStore;
