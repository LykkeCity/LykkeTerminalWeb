import {MockWatchlistApi} from '../../api/watchlistApi';
import Watchlists from '../../models/watchlists';
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

    it('active watchlist should contain default watch list with name All Asset', () => {
      expect(watchlistStore.activeWatchlists instanceof Array).toBeTruthy();
      expect(watchlistStore.activeWatchlists.length).toBe(1);
      expect(watchlistStore.activeWatchlists[0].name).toBe(Watchlists.All);
    });
  });

  describe('reset', () => {
    it('should reset watchlists to default state', async () => {
      await watchlistStore.fetchAll();
      expect(watchlistStore.activeWatchlists[0].name).not.toBe(Watchlists.All);
      watchlistStore.reset();

      expect(watchlistStore.activeWatchlists[0].name).toBe(Watchlists.All);
    });
  });
});
