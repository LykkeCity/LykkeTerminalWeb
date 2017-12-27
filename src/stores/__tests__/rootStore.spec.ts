import {RootStore} from '../index';

describe('root store', () => {
  let rootStore: RootStore;

  beforeEach(() => {
    rootStore = new RootStore();
  });

  describe('reset stores', () => {
    it('should call reset on watchlist store', () => {
      rootStore.watchlistStore.reset = jest.fn();
      rootStore.authStore.reset = jest.fn();

      rootStore.reset();

      expect(rootStore.watchlistStore.reset).toHaveBeenCalled();
      expect(rootStore.watchlistStore.reset).toHaveBeenCalledTimes(1);
    });
  });
});
