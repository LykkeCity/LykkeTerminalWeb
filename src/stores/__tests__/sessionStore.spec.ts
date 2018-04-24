import {SessionStore, RootStore} from '../index';

describe('auth store', () => {
  let sessionStore: SessionStore;
  const api: any = {
    saveSessionNoteShown: jest.fn(),
    loadSessionNoteShown: jest.fn(),
    getSessionStatus: () => {
      return {
        TradingSession: {
          Confirmed: true,
          Ttl: 70000
        }
      };
    },
    extendSession: jest.fn(),
    createSession: jest.fn(),
    saveSessionDuration: jest.fn(),
    getSessionDuration: () => Promise.resolve({Data: '60000'})
  };

  beforeEach(() => {
    sessionStore = new SessionStore(new RootStore(true), api);
  });

  describe('store', () => {
    it('should show view mode notification', () => {
      expect(sessionStore.viewModeNotificationShown).toBeFalsy();
      sessionStore.continueInViewMode();
      expect(sessionStore.viewModeNotificationShown).toBeTruthy();
    });

    it('should hide view mode notification', () => {
      sessionStore.continueInViewMode();
      expect(sessionStore.viewModeNotificationShown).toBeTruthy();
      sessionStore.startTrade();
      expect(sessionStore.viewModeNotificationShown).toBeFalsy();
    });

    it('should call saveSessionNoteShown', () => {
      sessionStore.saveSessionNoteShownDate(1);
      expect(api.saveSessionNoteShown).toHaveBeenCalled();
      expect(api.saveSessionNoteShown).toHaveBeenCalledTimes(1);
    });

    it('should return false by default for isSessionNotesShown', () => {
      expect(sessionStore.getSessionNotesShown()).toBeFalsy();
    });

    it('should save session duration', () => {
      sessionStore.handleSetDuration(1);
      expect(sessionStore.sessionCurrentDuration).toBe(1);
      expect(api.saveSessionDuration).toHaveBeenCalled();
      expect(api.saveSessionDuration).toHaveBeenCalledTimes(1);
    });

    it('should increase time to left', () => {
      const sessionDurationInMinute = 1;
      const sessionDurationInSeconds = sessionDurationInMinute * 60;
      sessionStore.handleSetDuration(sessionDurationInMinute);
      sessionStore.extendSession();

      expect(sessionStore.sessionRemain).toBe(sessionDurationInSeconds);

      expect(api.extendSession).toHaveBeenCalled();
      expect(api.extendSession).toHaveBeenCalledTimes(1);
    });
  });
});
