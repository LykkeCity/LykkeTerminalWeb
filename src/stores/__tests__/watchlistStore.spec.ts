import {MockWatchlistApi} from '../../api/watchlistApi';
import {RootStore, WatchlistStore} from '../index';

describe('watchlist store', () => {
  let watchlistStore: WatchlistStore;

  beforeEach(() => {
    watchlistStore = new WatchlistStore(
      new RootStore(false),
      new MockWatchlistApi({})
    );
  });

  describe('state', () => {
    it('watchlists should be defined after instantiation', () => {
      expect(watchlistStore.activeWatchlists).toBeDefined();
      expect(watchlistStore.activeWatchlists).not.toBeNull();
    });

    it('active watchlist should be an empty array by default', () => {
      expect(watchlistStore.activeWatchlists instanceof Array).toBeTruthy();
      expect(watchlistStore.activeWatchlists.length).toBe(1);
    });
  });

  describe('reset', () => {
    it('should clear watchlists', () => {
      watchlistStore.reset();

      expect(watchlistStore.activeWatchlists.length).toBe(1);
    });
  });
});
