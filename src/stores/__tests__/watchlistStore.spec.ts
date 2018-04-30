import {MockWatchlistApi} from '../../api/watchlistApi';
import {InstrumentModel} from '../../models';
import WatchlistModel from '../../models/watchlistModel';
import Watchlists from '../../models/watchlists';
import {RootStore, WatchlistStore} from '../index';

describe('watchlist store', () => {
  const getInstruments = jest.fn(() => [
    new InstrumentModel({
      id: 'LKKUSD',
      name: 'LKK/USD'
    })
  ]);
  const watchlistStore = new WatchlistStore(
    new RootStore(),
    new MockWatchlistApi(),
    getInstruments
  );
  watchlistStore.fetchAll = jest.fn(() => []);

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

    it('should return name of watchlist', () => {
      expect(watchlistStore.activeWatchlists[0].name).toBe(
        watchlistStore.watchlistNames[0]
      );
    });

    it('should return watchlist by its name', () => {
      const watchlist = watchlistStore.getWatchlistByName(Watchlists.All);
      expect(watchlist!.name).toBe(Watchlists.All);
    });
  });

  describe('allInstrumentsWatchlists', () => {
    it('should return instruments given', () => {
      expect(watchlistStore.allInstrumentsWatchlist.assetIds).toHaveLength(
        getInstruments().length
      );
    });

    it('should return only 1 watchlist with All instruments', () => {
      const num = 3;
      for (let idx = 0; idx < num; idx++) {
        watchlistStore.addWatchlist(
          new WatchlistModel({id: `${idx}`, name: `${idx}`})
        );
      }
      for (let idx = 0; idx < num; idx++) {
        watchlistStore.addWatchlist(
          new WatchlistModel({id: `default${idx}`, name: Watchlists.All})
        );
      }

      expect(watchlistStore.activeWatchlists).toHaveLength(num + 1);
      expect(
        watchlistStore.activeWatchlists.filter(w => w.name === Watchlists.All)
      ).toHaveLength(1);
      expect(watchlistStore.watchlistNames).toHaveLength(num + 1);
      expect(
        watchlistStore.watchlistNames.filter(x => x === Watchlists.All)
      ).toHaveLength(1);
    });
  });

  describe('reset', () => {
    it('should reset watchlists to default state', async () => {
      watchlistStore.reset();
      expect(watchlistStore.activeWatchlists).toHaveLength(1);
      expect(watchlistStore.activeWatchlists[0].name).toBe(Watchlists.All);
    });
  });
});
