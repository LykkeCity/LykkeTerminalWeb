import {computed, observable} from 'mobx';
import {SessionApi} from '../api';
import ModalMessages from '../constants/modalMessages';
import {keys} from '../models';
import ModalModel from '../models/modalModel';
import Types from '../models/modals';
import {
  convertMinutesToMs,
  convertMsToMinutes,
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

const DEFAULT_SESSION_DURATION = 300000;

class SessionStore extends BaseStore {
  @computed
  get sessionNotificationsBlockShown() {
    return this.isSessionNotificationShown || this.isViewModeNotificationShown;
  }

  @computed
  get sessionNotificationShown() {
    return this.isSessionNotificationShown;
  }

  @computed
  get viewModeNotificationShown() {
    return this.isViewModeNotificationShown;
  }

  @computed
  get sessionRemain() {
    return this.ttl;
  }

  @computed
  get sessionCurrentDuration() {
    return convertMsToMinutes(this.sessionDuration); // returns minutes
  }

  @observable private isSessionNotificationShown: boolean = false;
  @observable private isViewModeNotificationShown: boolean = false;
  @observable private sessionDuration: number;
  @observable private ttl: number = 0;
  private currentQrId: string = '';
  private isSessionNotesShown: boolean = false;
  private sessionRemainIntervalId: any;
  private pollingSessionTimerId: any;
  private sessionConfirmationExpireTimerId: any;
  private qrModal: ModalModel;

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
    const {Confirmed, Ttl} = session.TradingSession;
    this.sessionDuration = await this.getSessionDuration();
    this.ttl = Math.floor(convertMsToSeconds(Ttl));

    this.setQrId();

    if (!Confirmed) {
      this.rootStore.uiStore.runViewMode();
      this.startSessionListener();
      return;
    }

    this.rootStore.uiStore.stopViewMode();
    if (this.ttl - SESSION_WARNING_REMAINING >= 0) {
      this.runSessionNotificationTimeout();
    } else {
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
    const timeoutId = setTimeout(() => {
      this.ttl = SESSION_REMAINS;
      this.showSessionNotification();
      clearTimeout(timeoutId);
    }, convertSecondsToMs(this.ttl - SESSION_WARNING_REMAINING));
  };

  showQR = () => {
    this.qrModal = this.rootStore.modalStore.addModal(
      ModalMessages.qr,
      // tslint:disable-next-line:no-empty
      () => {},
      this.continueInViewMode,
      Types.QR
    );
  };

  startSessionListener = async () => {
    await this.api.createSession(this.sessionDuration);
    this.sessionConfirmationExpire();

    this.showQR();

    this.pollingSessionTimerId = setInterval(() => {
      this.api.getSessionStatus().then((res: any) => {
        const {Confirmed} = res.TradingSession;
        if (Confirmed) {
          this.sessionConfirmed();
          this.stopPollingSession();
          this.qrModal.close();
        }
      });
    }, 1000);
  };

  sessionConfirmationExpire = () => {
    this.sessionConfirmationExpireTimerId = setTimeout(() => {
      this.qrModal.close();
      this.continueInViewMode();
    }, this.sessionDuration);
  };

  continueInViewMode = () => {
    this.stopPollingSession();
    this.showViewModeNotification();
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
        this.runSessionRemains();
      })
      .catch(() => {
        this.saveSessionNoteShownDate(currentDate);
        this.isSessionNotesShown = true;
        this.isSessionNotificationShown = true;
        this.runSessionRemains();
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
    this.showViewModeNotification();
    this.rootStore.uiStore.runViewMode();
  };

  sessionConfirmed = () => {
    this.extendSession();
    this.stopListenSessionConfirmationExpire();
    this.rootStore.uiStore.stopViewMode();
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

  showViewModeNotification = () => {
    this.isViewModeNotificationShown = true;
  };

  closeViewModeNotification = () => {
    this.isViewModeNotificationShown = false;
  };

  getSessionNotesShown = () => {
    return this.isSessionNotesShown;
  };

  getQrId = () => {
    return this.currentQrId;
  };

  extendSession = async () => {
    this.stopSessionRemains();
    this.ttl = convertMsToSeconds(this.sessionDuration);
    await this.api.extendSession(this.sessionDuration);
    this.runSessionNotificationTimeout();
  };

  startTrade = () => {
    this.startSessionListener();
    this.closeViewModeNotification();
  };

  handleSetDuration = (value: number) => {
    this.sessionDuration = convertMinutesToMs(value);
    this.api.saveSessionDuration(this.sessionDuration);
  };

  reset = () => {
    this.stopSessionRemains();
    this.stopPollingSession();
    this.currentQrId = '';
  };

  private stopSessionRemains = () => {
    clearInterval(this.sessionRemainIntervalId);
    this.sessionRemainIntervalId = null;
  };

  private stopPollingSession = () => {
    clearInterval(this.pollingSessionTimerId);
    this.pollingSessionTimerId = null;
  };

  private stopListenSessionConfirmationExpire = () => {
    clearInterval(this.sessionConfirmationExpireTimerId);
    this.sessionConfirmationExpireTimerId = null;
  };
}

export default SessionStore;
