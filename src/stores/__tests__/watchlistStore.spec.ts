import {InstrumentModel} from '../../models';
import Watchlists from '../../models/watchlists';
import {RootStore, WatchlistStore} from '../index';

describe('watchlist store', () => {
  const getInstruments = jest.fn(() => [
    new InstrumentModel({
      id: 'LKKUSD',
      name: 'LKK/USD'
    })
  ]);

  const api = {
    fetchAll: jest.fn(() => [])
  };

  const watchlistStore = new WatchlistStore(
    new RootStore(),
    api as any,
    getInstruments
  );

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
      expect(watchlistStore.allInstrumentsWatchlist.assetPairIds).toHaveLength(
        getInstruments().length
      );
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
