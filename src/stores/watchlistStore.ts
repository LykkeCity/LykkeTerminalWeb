import {computed, observable, runInAction} from 'mobx';
import {WatchlistApi} from '../api/index';
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
  get allWatchlists() {
    return this.watchlists;
  }

  @observable private watchlists: any[] = [];

  constructor(store: RootStore, private readonly api: WatchlistApi) {
    super(store);
  }

  getWatchlistById = (id: string) => this.watchlists.find(x => x.id === id);

  fetchAll = async () => {
    const resp = await this.api.fetchAll();
    runInAction(() => {
      this.watchlists = resp.map(this.mapFromDto);
    });
  };

  reset = () => {
    this.watchlists = [];
  };

  private mapFromDto = ({Id, Name, AssetIds}: any) => ({
    id: Id,
    name: Name,
    // tslint:disable-next-line:object-literal-sort-keys
    assetIds: AssetIds
  });
}

export default WatchlistStore;
