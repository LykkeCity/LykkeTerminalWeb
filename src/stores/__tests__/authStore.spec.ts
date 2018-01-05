import {AuthStore, RootStore} from '../index';

describe('auth store', () => {
  let authStore: AuthStore;
  const api: any = {
    fetchBearerToken: jest.fn()
  };

  beforeEach(() => {
    authStore = new AuthStore(new RootStore(false), api);
  });

  describe('store', () => {
    it('should save a token', async () => {
      api.fetchBearerToken = jest.fn(() =>
        Promise.resolve({AccessToken: 'token'})
      );
      await authStore.fetchBearerToken('user', 'password');
      expect(authStore.isAuth).toBeTruthy();
    });

    it('should reset a token', async () => {
      api.fetchBearerToken = jest.fn(() =>
        Promise.resolve({AccessToken: 'token'})
      );
      await authStore.fetchBearerToken('user', 'password');
      expect(authStore.isAuth).toBeTruthy();
      authStore.reset();
      expect(authStore.isAuth).toBeFalsy();
    });
  });
});
