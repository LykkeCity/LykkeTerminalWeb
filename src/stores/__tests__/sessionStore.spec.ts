import {
  convertHoursToMs,
  convertMsToHours,
  convertMsToSeconds,
  convertSecondsToMs
} from '../../utils/dateFns';
import {RootStore, SessionStore} from '../index';

jest.useFakeTimers();

describe('session store', () => {
  let sessionStore: SessionStore;
  const confirmation = {
    Confirmed: true,
    Ttl: 70000,
    Enabled: true
  };
  const sessionDuration = {Data: '60000'};

  describe('store', () => {
    let api: any;
    beforeEach(() => {
      api = {
        saveSessionNoteShown: jest.fn(),
        loadSessionNoteShown: () => Promise.resolve({Data: '60000'}),
        getSessionStatus: () => {
          return {
            TradingSession: confirmation
          };
        },
        get2faStatus: () => Promise.resolve([]),
        extendSession: jest.fn(),
        extend2faSession: jest.fn(),
        createSession: jest.fn(),
        saveSessionDuration: jest.fn(),
        getSessionDuration: () => Promise.resolve(sessionDuration)
      };

      sessionStore = new SessionStore(new RootStore(true), api);
      sessionStore.rootStore.authStore.signOut = jest.fn();
    });

    it('should show read-only mode notification', () => {
      expect(sessionStore.readOnlyModeNotificationShown).toBeFalsy();
      sessionStore.continueInReadOnlyMode();
      expect(sessionStore.readOnlyModeNotificationShown).toBeTruthy();
    });

    it('should hide read-only mode notification', () => {
      sessionStore.continueInReadOnlyMode();
      expect(sessionStore.readOnlyModeNotificationShown).toBeTruthy();
      sessionStore.startTrade();
      expect(sessionStore.readOnlyModeNotificationShown).toBeFalsy();
    });

    it('should call saveSessionNoteShown', () => {
      sessionStore.saveSessionNoteShownDate(1);
      expect(api.saveSessionNoteShown).toHaveBeenCalled();
      expect(api.saveSessionNoteShown).toHaveBeenCalledTimes(1);
    });

    it('should return false by default for isSessionNotesShown', () => {
      expect(sessionStore.getSessionNotesShown()).toBeFalsy();
    });

    it('should save session duration', async () => {
      await sessionStore.handleSetDuration(1);
      expect(sessionStore.sessionCurrentDuration).toBe(1);
      expect(api.saveSessionDuration).toHaveBeenCalled();
      expect(api.saveSessionDuration).toHaveBeenCalledTimes(1);
    });

    it('should increase time to left', async () => {
      const sessionDurationInHours = 1;
      await sessionStore.handleSetDuration(sessionDurationInHours);

      const sessionDurationInSeconds = sessionDurationInHours * 3600;
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
        convertMsToHours(+sessionDuration.Data)
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

    it('should set read-only mode to true', () => {
      expect(sessionStore.rootStore.uiStore.readOnlyMode).toBeFalsy();
      expect(sessionStore.readOnlyModeNotificationShown).toBeFalsy();
      sessionStore.sessionExpired();
      expect(sessionStore.rootStore.uiStore.readOnlyMode).toBeTruthy();
      expect(sessionStore.readOnlyModeNotificationShown).toBeTruthy();
    });

    it('should show read-only mode notification', () => {
      expect(sessionStore.readOnlyModeNotificationShown).toBeFalsy();
      sessionStore.sessionExpired();
      expect(sessionStore.readOnlyModeNotificationShown).toBeTruthy();
    });

    it('should close session notification', async () => {
      await sessionStore.showSessionNotification();
      expect(sessionStore.sessionNotificationShown).toBeTruthy();
      sessionStore.sessionExpired();
      expect(sessionStore.sessionNotificationShown).toBeFalsy();
    });

    it('should set read-only mode to false', () => {
      sessionStore.sessionExpired();
      expect(sessionStore.rootStore.uiStore.readOnlyMode).toBeTruthy();
      sessionStore.sessionConfirmed();
      expect(sessionStore.rootStore.uiStore.readOnlyMode).toBeFalsy();
    });

    it('should stop session remains timeout', () => {
      sessionStore.stopSessionRemains = jest.fn();
      sessionStore.sessionExpired();
      expect(sessionStore.stopSessionRemains).toHaveBeenCalled();
      expect(sessionStore.stopSessionRemains).toHaveBeenCalledTimes(1);
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

    it('should set true to isReadOnlyModeNotificationShown', () => {
      sessionStore.showReadOnlyModeNotification();
      expect(sessionStore.readOnlyModeNotificationShown).toBeTruthy();
    });

    it('should set false to isReadOnlyModeNotificationShown', () => {
      sessionStore.showReadOnlyModeNotification();
      expect(sessionStore.readOnlyModeNotificationShown).toBeTruthy();
      sessionStore.closeReadOnlyModeNotification();
      expect(sessionStore.readOnlyModeNotificationShown).toBeFalsy();
    });

    it('should return value of isSessionNotesShown', () => {
      expect(sessionStore.getSessionNotesShown()).toBeFalsy();
    });

    it('should return value of currentQrId. empty string by default', () => {
      expect(sessionStore.getQrId()).toBe('');
    });

    it('should continue in read-only mode after session duration is over', async () => {
      const duration = 1;
      sessionStore.continueInReadOnlyMode = jest.fn();
      sessionStore.showQR();
      await sessionStore.handleSetDuration(duration);
      sessionStore.sessionConfirmationExpire();
      expect(sessionStore.continueInReadOnlyMode).not.toHaveBeenCalled();

      jest.runTimersToTime(convertHoursToMs(duration));

      expect(sessionStore.continueInReadOnlyMode).toHaveBeenCalled();
      expect(sessionStore.continueInReadOnlyMode).toHaveBeenCalledTimes(1);
    });

    it('should call showSessionNotification after extended time is over', async () => {
      sessionStore.showSessionNotification = jest.fn();

      const extendedTime = 0.03;
      const SESSION_WARNING_REMAINING = 60;
      const ttl = convertMsToSeconds(convertHoursToMs(extendedTime));
      const timeout = convertSecondsToMs(ttl - SESSION_WARNING_REMAINING);
      await sessionStore.handleSetDuration(extendedTime);

      expect(sessionStore.showSessionNotification).not.toHaveBeenCalled();

      jest.runTimersToTime(convertHoursToMs(timeout));

      expect(sessionStore.showSessionNotification).toHaveBeenCalled();
      expect(sessionStore.showSessionNotification).toHaveBeenCalledTimes(1);
    });

    it('should run and stop session remains during extending session', async () => {
      sessionStore.stopSessionRemains = jest.fn();
      sessionStore.runSessionNotificationTimeout = jest.fn();
      sessionStore.runSessionRemains = jest.fn();
      sessionStore.stopSessionNotificationTimeout = jest.fn();

      await sessionStore.extendSession();

      expect(sessionStore.stopSessionRemains).toHaveBeenCalled();
      expect(sessionStore.stopSessionRemains).toHaveBeenCalledTimes(2);

      expect(sessionStore.runSessionRemains).toHaveBeenCalled();
      expect(sessionStore.runSessionRemains).toHaveBeenCalledTimes(1);

      expect(sessionStore.stopSessionNotificationTimeout).toHaveBeenCalled();
      expect(sessionStore.stopSessionNotificationTimeout).toHaveBeenCalledTimes(
        1
      );

      expect(sessionStore.runSessionNotificationTimeout).toHaveBeenCalled();
      expect(sessionStore.runSessionNotificationTimeout).toHaveBeenCalledTimes(
        1
      );
    });

    it('should clear sessionConfirmationExpireTimerId', async () => {
      sessionStore.continueInReadOnlyMode = jest.fn();
      await sessionStore.handleSetDuration(100);
      sessionStore.sessionConfirmationExpire();
      sessionStore.stopListenSessionConfirmationExpire();
      expect(sessionStore.continueInReadOnlyMode).not.toHaveBeenCalled();

      jest.runTimersToTime(100);

      expect(sessionStore.continueInReadOnlyMode).not.toHaveBeenCalled();
    });

    it('should stop polling session and stop listen session confirmation expire', () => {
      sessionStore.stopListenSessionConfirmationExpire = jest.fn();
      sessionStore.stopSessionPolling = jest.fn();
      sessionStore.continueInReadOnlyMode();

      expect(
        sessionStore.stopListenSessionConfirmationExpire
      ).toHaveBeenCalled();
      expect(
        sessionStore.stopListenSessionConfirmationExpire
      ).toHaveBeenCalledTimes(1);

      expect(sessionStore.stopSessionPolling).toHaveBeenCalled();
      expect(sessionStore.stopSessionPolling).toHaveBeenCalledTimes(1);
    });

    it('should run session notification timeout', async () => {
      sessionStore.runSessionNotificationTimeout = jest.fn();
      await sessionStore.initUserSession();
      expect(sessionStore.runSessionNotificationTimeout).toHaveBeenCalled();
      expect(sessionStore.runSessionNotificationTimeout).toHaveBeenCalledTimes(
        1
      );
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
        get2faStatus: () => Promise.resolve([]),
        extendSession: jest.fn(),
        extend2faSession: jest.fn(),
        createSession: jest.fn(),
        saveSessionDuration: jest.fn(),
        getSessionDuration: () => Promise.resolve(sessionDuration)
      };

      sessionStore = new SessionStore(new RootStore(true), api);
      sessionStore.rootStore.authStore.signOut = jest.fn();
    });

    it('should show session notes because of time limit expires', async () => {
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
        get2faStatus: () => Promise.resolve([]),
        extendSession: jest.fn(),
        extend2faSession: jest.fn(),
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

  describe('with disabled session', () => {
    beforeEach(() => {
      confirmation.Enabled = false;
      const api: any = {
        saveSessionNoteShown: jest.fn(),
        loadSessionNoteShown: jest.fn(),
        getSessionStatus: () => {
          return {
            TradingSession: confirmation
          };
        },
        get2faStatus: () => Promise.resolve([]),
        extendSession: jest.fn(),
        extend2faSession: jest.fn(),
        createSession: jest.fn(),
        saveSessionDuration: jest.fn(),
        getSessionDuration: () => Promise.resolve(sessionDuration)
      };

      sessionStore = new SessionStore(new RootStore(true), api);
      sessionStore.rootStore.authStore.signOut = jest.fn();
    });

    it('should stop read-only mode if session disabled', async () => {
      sessionStore.rootStore.uiStore.runReadOnlyMode();
      expect(sessionStore.rootStore.uiStore.readOnlyMode).toBeTruthy();
      await sessionStore.initUserSession();
      expect(sessionStore.rootStore.uiStore.readOnlyMode).toBeFalsy();
    });
  });

  describe('with expiring time', () => {
    beforeEach(() => {
      confirmation.Ttl = 50000;
      confirmation.Enabled = true;
      const api: any = {
        saveSessionNoteShown: jest.fn(),
        loadSessionNoteShown: jest.fn(),
        getSessionStatus: () => {
          return {
            TradingSession: confirmation
          };
        },
        get2faStatus: () => Promise.resolve([]),
        extendSession: jest.fn(),
        extend2faSession: jest.fn(),
        createSession: jest.fn(),
        saveSessionDuration: jest.fn(),
        getSessionDuration: () => Promise.reject('error')
      };

      sessionStore = new SessionStore(new RootStore(true), api);
      sessionStore.rootStore.authStore.signOut = jest.fn();
    });

    it('should run session remains and call showSessionNotification', async () => {
      sessionStore.runSessionRemains = jest.fn();
      sessionStore.showSessionNotification = jest.fn();
      await sessionStore.initUserSession();
      expect(sessionStore.runSessionRemains).toHaveBeenCalled();
      expect(sessionStore.runSessionRemains).toHaveBeenCalledTimes(1);

      expect(sessionStore.showSessionNotification).toHaveBeenCalled();
      expect(sessionStore.showSessionNotification).toHaveBeenCalledTimes(1);
    });

    it('should set user default session duration', async () => {
      const defaultSessionDuration = 1800000;
      sessionStore.showSessionNotification = jest.fn();
      await sessionStore.initUserSession();
      expect(sessionStore.sessionCurrentDuration).toBe(
        convertMsToHours(defaultSessionDuration)
      );
    });
  });
});
