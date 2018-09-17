import {RootStore} from '../index';

describe('root store', () => {
  let rootStore: RootStore;

  beforeEach(() => {
    rootStore = new RootStore();
    rootStore.orderBookStore.unsubscribe = jest.fn();
    rootStore.priceStore.fetchDailyCandle = rootStore.priceStore.subscribeToDailyCandle = rootStore.priceStore.unsubscribeFromDailyCandle = jest.fn();
    rootStore.authStore.reset = jest.fn();
    rootStore.tradeStore.unsubscribeFromPublicTrades = jest.fn();
  });

  describe('reset stores', () => {
    it('should call reset on watchlist store', () => {
      rootStore.watchlistStore.reset = jest.fn();
      rootStore.socketStore.reset = jest.fn();

      rootStore.reset();

      expect(rootStore.watchlistStore.reset).toHaveBeenCalled();
      expect(rootStore.watchlistStore.reset).toHaveBeenCalledTimes(1);
    });
  });
});
