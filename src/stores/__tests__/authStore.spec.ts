import {AuthStore, RootStore} from '../index';

fdescribe('auth store', () => {
  let authStore: AuthStore;
  const api: any = {
    fetchBearerToken: jest.fn(),
    fetchUserInfo: jest.fn()
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

    it('should save positive KYC status and return truthy isKycPassed', async () => {
      api.fetchUserInfo = jest.fn(() => Promise.resolve({KycStatus: 'Ok'}));
      await authStore.fetchUserInfo('token');
      expect(authStore.isKycPassed).toBeTruthy();
    });

    it('should save negative KYC status and return falsy isKycPassed', async () => {
      api.fetchUserInfo = jest.fn(() => Promise.resolve({KycStatus: 'NoData'}));
      await authStore.fetchUserInfo('token');
      expect(authStore.isKycPassed).toBeFalsy();
    });

    it('should reset token and KYC status', async () => {
      api.fetchBearerToken = jest.fn(() =>
        Promise.resolve({AccessToken: 'token'})
      );
      api.fetchUserInfo = jest.fn(() => Promise.resolve({KycStatus: 'Ok'}));

      await authStore.fetchBearerToken('user', 'password');
      await authStore.fetchUserInfo('token');

      expect(authStore.isAuth).toBeTruthy();
      expect(authStore.isKycPassed).toBeTruthy();

      authStore.reset();

      expect(authStore.isAuth).toBeFalsy();
      expect(authStore.isKycPassed).toBeFalsy();
    });
  });
});
