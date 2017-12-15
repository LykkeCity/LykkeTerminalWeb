import {WatchlistApi} from '../api/index';
import {BaseStore, WatchlistStore} from './index';

class RootStore {
  readonly watchlistStore: WatchlistStore;

  private readonly stores = new Set<BaseStore>();

  constructor(shouldStartImmediately = true) {
    if (shouldStartImmediately) {
      this.watchlistStore = new WatchlistStore(this, new WatchlistApi());
    }
  }

  registerStore = (store: BaseStore) => this.stores.add(store);

  reset = () => {
    Array.from(this.stores).forEach(s => s.reset());
  };
}

export default RootStore;
