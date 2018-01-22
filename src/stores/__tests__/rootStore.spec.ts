import {WampApi} from '../../api/index';
import {RootStore} from '../index';

describe('root store', () => {
  let rootStore: RootStore;

  beforeEach(() => {
    rootStore = new RootStore();
    rootStore.authStore.reset = jest.fn();
  });

  describe('reset stores', () => {
    it('should call reset on watchlist store', () => {
      rootStore.watchlistStore.reset = jest.fn();
      WampApi.close = jest.fn();

      rootStore.reset();

      expect(rootStore.watchlistStore.reset).toHaveBeenCalled();
      expect(rootStore.watchlistStore.reset).toHaveBeenCalledTimes(1);
    });
  });
});
