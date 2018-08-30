import {computed, observable} from 'mobx';
import {SessionApi} from '../api';
import ModalMessages from '../constants/modalMessages';
import {keys} from '../models';
import ModalModel from '../models/modalModel';
import Types from '../models/modals';
import {
  convertHoursToMs,
  convertMsToHours,
  convertMsToSeconds,
  convertSecondsToMs,
  getDiffDays
} from '../utils/dateFns';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const SESSION_NOTE_HIDDEN_DURATION = 30; // days
const SESSION_REMAINS = 59; // seconds
const SESSION_WARNING_REMAINING = 60; // seconds

const sessionTokenStorage = StorageUtils(keys.sessionToken);

const DEFAULT_SESSION_DURATION = 1800000;

class SessionStore extends BaseStore {
  @computed
  get sessionNotificationsBlockShown() {
    return (
      this.isSessionNotificationShown || this.isReadOnlyModeNotificationShown
    );
  }

  @computed
  get sessionNotificationShown() {
    return this.isSessionNotificationShown;
  }

  @computed
  get readOnlyModeNotificationShown() {
    return this.isReadOnlyModeNotificationShown;
  }

  @computed
  get sessionRemain() {
    return this.ttl;
  }

  @computed
  get sessionCurrentDuration() {
    return convertMsToHours(this.sessionDuration); // returns hours
  }

  @observable private isSessionNotificationShown: boolean = false;
  @observable private isReadOnlyModeNotificationShown: boolean = false;
  @observable private sessionDuration: number;
  @observable private ttl: number = 0;
  private currentQrId: string = '';
  private isSessionNotesShown: boolean = false;
  private sessionRemainIntervalId: any;
  private sessionConfirmationExpireTimerId: any;
  private qrModal: ModalModel;
  private sessionPollingTimerId: any;
  private sessionNotificationTimeoutId: any;

  constructor(store: RootStore, private readonly api: SessionApi) {
    super(store);
  }

  getSessionDuration = async () => {
    return this.api
      .getSessionDuration()
      .then((duration: any) => Promise.resolve(+duration.Data))
      .catch((e: any) => Promise.resolve(DEFAULT_SESSION_DURATION));
  };

  initUserSession = async () => {
    const session = await this.api.getSessionStatus();
    const {Confirmed, Ttl, Enabled} = session.TradingSession;

    if (!Enabled) {
      this.rootStore.uiStore.stopReadOnlyMode();
      return;
    }

    this.sessionDuration = await this.getSessionDuration();
    this.ttl = Math.floor(convertMsToSeconds(Ttl));

    this.setQrId();

    if (!Confirmed) {
      this.rootStore.uiStore.runReadOnlyMode();
      this.startSessionListener();
      return;
    }
    this.rootStore.uiStore.stopReadOnlyMode();
    if (this.ttl - SESSION_WARNING_REMAINING >= 0) {
      this.runSessionNotificationTimeout();
    } else {
      this.runSessionRemains();
      this.showSessionNotification();
    }
  };

  setQrId = () => {
    const sessionToken = sessionTokenStorage.get();
    if (!sessionToken) {
      this.rootStore.authStore.signOut();
      return;
    }
    this.currentQrId = sessionToken;
  };

  runSessionNotificationTimeout = () => {
    this.sessionNotificationTimeoutId = setTimeout(() => {
      if (this.ttl > SESSION_REMAINS) {
        this.ttl = SESSION_REMAINS;
      }
      this.runSessionRemains();
      this.showSessionNotification();
      clearTimeout(this.sessionNotificationTimeoutId);
    }, convertSecondsToMs(this.ttl - SESSION_WARNING_REMAINING));
  };

  showQR = () => {
    this.qrModal = this.rootStore.modalStore.addModal(
      ModalMessages.qr,
      // tslint:disable-next-line:no-empty
      () => {},
      this.continueInReadOnlyMode,
      Types.QR
    );
  };

  startSessionListener = async () => {
    await this.api.createSession(this.sessionDuration);
    this.sessionConfirmationExpire();

    this.showQR();

    const polling = () => {
      this.sessionPollingTimerId = setTimeout(async () => {
        const sessionStatus = await this.api.getSessionStatus();
        const {Confirmed} = sessionStatus.TradingSession;

        if (Confirmed) {
          this.sessionConfirmed();
          this.qrModal.close();
          this.stopSessionPolling();
          return;
        }

        polling();
      }, 1000);
    };

    polling();
  };

  sessionConfirmationExpire = () => {
    this.sessionConfirmationExpireTimerId = setTimeout(() => {
      this.qrModal.close();
      this.continueInReadOnlyMode();
    }, this.sessionDuration);
  };

  continueInReadOnlyMode = () => {
    this.stopListenSessionConfirmationExpire();
    this.stopSessionPolling();
    this.showReadOnlyModeNotification();
  };

  showSessionNotification = () => {
    const currentDate = new Date().getTime();
    return this.api
      .loadSessionNoteShown()
      .then((resp: any) => {
        const noteLastSeen = +resp.Data;
        if (
          getDiffDays(currentDate, noteLastSeen) > SESSION_NOTE_HIDDEN_DURATION
        ) {
          this.saveSessionNoteShownDate(currentDate);
          this.isSessionNotesShown = true;
        } else {
          this.isSessionNotesShown = false;
        }
        this.isSessionNotificationShown = true;
      })
      .catch(() => {
        this.saveSessionNoteShownDate(currentDate);
        this.isSessionNotesShown = true;
        this.isSessionNotificationShown = true;
      });
  };

  runSessionRemains = () => {
    this.sessionRemainIntervalId = setInterval(() => {
      if (this.ttl < 1) {
        this.sessionExpired();
        return;
      }
      this.timeTick();
    }, 1000);
  };

  sessionExpired = () => {
    this.stopSessionRemains();
    this.closeSessionNotification();
    this.showReadOnlyModeNotification();
    this.rootStore.uiStore.runReadOnlyMode();
  };

  sessionConfirmed = () => {
    this.stopListenSessionConfirmationExpire();
    this.extendSession();
    this.rootStore.uiStore.stopReadOnlyMode();
  };

  extendSession = async () => {
    this.stopSessionRemains();
    this.ttl = convertMsToSeconds(this.sessionDuration);
    this.runSessionRemains();
    await this.api.extendSession(this.sessionDuration);
    this.stopSessionRemains();
    this.stopSessionNotificationTimeout();
    this.runSessionNotificationTimeout();
  };

  timeTick = () => {
    this.ttl -= 1;
  };

  saveSessionNoteShownDate = (date: number) => {
    this.api.saveSessionNoteShown({
      Data: `${date}`
    });
  };

  closeSessionNotification = () => {
    this.isSessionNotificationShown = false;
  };

  showReadOnlyModeNotification = () => {
    this.isReadOnlyModeNotificationShown = true;
  };

  closeReadOnlyModeNotification = () => {
    this.isReadOnlyModeNotificationShown = false;
  };

  getSessionNotesShown = () => {
    return this.isSessionNotesShown;
  };

  getQrId = () => {
    return this.currentQrId;
  };

  startTrade = () => {
    this.startSessionListener();
    this.closeReadOnlyModeNotification();
  };

  handleSetDuration = async (value: number) => {
    this.sessionDuration = convertHoursToMs(value);
    this.api.saveSessionDuration(this.sessionDuration);

    const sessionStatus = await this.api.getSessionStatus();
    const {Enabled} = sessionStatus.TradingSession;
    if (Enabled) {
      await this.extendSession();
    }
  };

  reset = () => {
    this.stopSessionRemains();
    this.stopListenSessionConfirmationExpire();
    this.currentQrId = '';
  };

  stopSessionRemains = () => {
    clearInterval(this.sessionRemainIntervalId);
    this.sessionRemainIntervalId = null;
  };

  stopListenSessionConfirmationExpire = () => {
    clearInterval(this.sessionConfirmationExpireTimerId);
    this.sessionConfirmationExpireTimerId = null;
  };

  stopSessionPolling = () => {
    clearTimeout(this.sessionPollingTimerId);
    this.sessionPollingTimerId = null;
  };

  stopSessionNotificationTimeout = () => {
    clearTimeout(this.sessionNotificationTimeoutId);
    this.sessionNotificationTimeoutId = null;
  };
}

export default SessionStore;
