import {computed, observable, runInAction} from 'mobx';
import {WatchlistApi} from '../api/index';
import {BaseStore, RootStore} from './index';

class WatchlistStore extends BaseStore {
  @computed
  get activeWatchlists() {
    return this.watchlists;
  }

  @computed
  get allWatchlists() {
    return this.watchlists;
  }

  @observable private watchlists: any[] = [];

  constructor(store: RootStore, private readonly api: WatchlistApi) {
    super(store);
  }

  createWatchlist = ({id, name, assets}: any) => ({
    id,
    name,
    // tslint:disable-next-line:object-literal-sort-keys
    assets
  });

  fetchAll = async () => {
    const resp = await this.api.fetchAll();
    runInAction(() => {
      this.watchlists = resp.map(this.createWatchlist);
    });
  };

  reset = () => {
    this.watchlists = [];
  };
}

export default WatchlistStore;
