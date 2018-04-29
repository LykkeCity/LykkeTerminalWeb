import {RootStore, SessionStore} from '../index';
import {convertMsToMinutes, convertMsToSeconds} from '../../utils/dateFns';

jest.useFakeTimers();

describe('auth store', () => {
  let sessionStore: SessionStore;
  const confirmation = {
    Confirmed: true,
    Ttl: 70000
  };
  const sessionDuration = {Data: '60000'};

  describe('store', () => {
    const api: any = {
      saveSessionNoteShown: jest.fn(),
      loadSessionNoteShown: () => Promise.resolve({Data: '60000'}),
      getSessionStatus: () => {
        return {
          TradingSession: confirmation
        };
      },
      extendSession: jest.fn(),
      createSession: jest.fn(),
      saveSessionDuration: jest.fn(),
      getSessionDuration: () => Promise.resolve(sessionDuration)
    };

    beforeEach(() => {
      sessionStore = new SessionStore(new RootStore(true), api);
      sessionStore.rootStore.authStore.signOut = jest.fn();
    });

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

    it('should set time to left', async () => {
      await sessionStore.initUserSession();
      expect(sessionStore.sessionRemain).toBe(
        convertMsToSeconds(confirmation.Ttl)
      );
    });

    it('should set user default session duration', async () => {
      await sessionStore.initUserSession();
      expect(sessionStore.sessionCurrentDuration).toBe(
        convertMsToMinutes(+sessionDuration.Data)
      );
    });

    it('should open qr modal', () => {
      sessionStore.rootStore.modalStore.addModal = jest.fn();
      sessionStore.showQR();
      expect(sessionStore.rootStore.modalStore.addModal).toHaveBeenCalled();
      expect(sessionStore.rootStore.modalStore.addModal).toHaveBeenCalledTimes(
        1
      );
    });

    it('should set view mode to true', () => {
      expect(sessionStore.rootStore.uiStore.viewMode).toBeFalsy();
      expect(sessionStore.viewModeNotificationShown).toBeFalsy();
      sessionStore.sessionExpired();
      expect(sessionStore.rootStore.uiStore.viewMode).toBeTruthy();
      expect(sessionStore.viewModeNotificationShown).toBeTruthy();
    });

    it('should show view mode notification', () => {
      expect(sessionStore.viewModeNotificationShown).toBeFalsy();
      sessionStore.sessionExpired();
      expect(sessionStore.viewModeNotificationShown).toBeTruthy();
    });

    it('should close session notification', async () => {
      await sessionStore.showSessionNotification();
      expect(sessionStore.sessionNotificationShown).toBeTruthy();
      sessionStore.sessionExpired();
      expect(sessionStore.sessionNotificationShown).toBeFalsy();
    });

    it('should set view mode to false', () => {
      sessionStore.sessionExpired();
      expect(sessionStore.rootStore.uiStore.viewMode).toBeTruthy();
      sessionStore.sessionConfirmed();
      expect(sessionStore.rootStore.uiStore.viewMode).toBeFalsy();
    });

    it('should decrease ttl by 1', async () => {
      await sessionStore.initUserSession();
      expect(sessionStore.sessionRemain).toBe(
        convertMsToSeconds(confirmation.Ttl)
      );
      sessionStore.timeTick();
      expect(sessionStore.sessionRemain).toBe(
        convertMsToSeconds(confirmation.Ttl) - 1
      );
    });

    it('should set false to isSessionNotificationShown', async () => {
      await sessionStore.showSessionNotification();
      expect(sessionStore.sessionNotificationShown).toBeTruthy();
      sessionStore.sessionExpired();
      expect(sessionStore.sessionNotificationShown).toBeFalsy();
    });

    it('should set true to isViewModeNotificationShown', () => {
      sessionStore.showViewModeNotification();
      expect(sessionStore.viewModeNotificationShown).toBeTruthy();
    });

    it('should set false to isViewModeNotificationShown', () => {
      sessionStore.showViewModeNotification();
      expect(sessionStore.viewModeNotificationShown).toBeTruthy();
      sessionStore.closeViewModeNotification();
      expect(sessionStore.viewModeNotificationShown).toBeFalsy();
    });

    it('should return value of isSessionNotesShown', () => {
      expect(sessionStore.getSessionNotesShown()).toBeFalsy();
    });

    it('should return value of currentQrId. empty string by default', () => {
      expect(sessionStore.getQrId()).toBe('');
    });
  });

  describe('showSessionNotification', () => {
    beforeEach(() => {
      const expiredSessionNotesDate =
        new Date().getTime() - 31 * 24 * 60 * 60 * 1000;
      const api: any = {
        saveSessionNoteShown: jest.fn(),
        loadSessionNoteShown: () =>
          Promise.resolve({Data: expiredSessionNotesDate}),
        getSessionStatus: () => {
          return {
            TradingSession: confirmation
          };
        },
        extendSession: jest.fn(),
        createSession: jest.fn(),
        saveSessionDuration: jest.fn(),
        getSessionDuration: () => Promise.resolve(sessionDuration)
      };

      sessionStore = new SessionStore(new RootStore(true), api);
      sessionStore.rootStore.authStore.signOut = jest.fn();
    });

    it('should show session notes because time limit expires', async () => {
      await sessionStore.showSessionNotification();
      expect(sessionStore.getSessionNotesShown()).toBeTruthy();
    });
  });

  describe('showSessionNotification', () => {
    beforeEach(() => {
      const expiredSessionNotesDate =
        new Date().getTime() - 29 * 24 * 60 * 60 * 1000;
      const api: any = {
        saveSessionNoteShown: jest.fn(),
        loadSessionNoteShown: () =>
          Promise.resolve({Data: expiredSessionNotesDate}),
        getSessionStatus: () => {
          return {
            TradingSession: confirmation
          };
        },
        extendSession: jest.fn(),
        createSession: jest.fn(),
        saveSessionDuration: jest.fn(),
        getSessionDuration: () => Promise.resolve(sessionDuration)
      };

      sessionStore = new SessionStore(new RootStore(true), api);
      sessionStore.rootStore.authStore.signOut = jest.fn();
    });

    it('should not show session notes because time limit does not expire', async () => {
      await sessionStore.showSessionNotification();
      expect(sessionStore.getSessionNotesShown()).toBeFalsy();
    });
  });
});
