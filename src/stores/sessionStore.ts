import {computed, observable} from 'mobx';
import {SessionApi} from '../api';
import ModalMessages from '../constants/modalMessages';
import {keys} from '../models';
import ModalModel from '../models/modalModel';
import Types from '../models/modals';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const SESSION_NOTE_HIDDEN_DURATION = 30;
const SESSION_REMAINS = 59;
const SESSION_WARNING_REMAINING = 60; // 1 minute

const sessionTokenStorage = StorageUtils(keys.sessionToken);

const DEFAULT_SESSION_DURATION = 60000;

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
    return this.sessionDuration / 60000;
  }

  @observable private isSessionNotificationShown: boolean = false;
  @observable private isViewModeNotificationShown: boolean = false;
  @observable private sessionDuration: number;
  @observable private ttl: number;
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
    this.sessionDuration = await this.getSessionDuration();
    const {Confirmed, Ttl} = session.TradingSession;
    this.ttl = Math.floor(Ttl / 1000);

    this.setQrId();

    if (!Confirmed) {
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
      this.api.getSessionStatus().then((res: any) => {
        // tslint:disable-next-line:no-console
        console.log(res);
      });
    }, (this.ttl - SESSION_WARNING_REMAINING) * 1000);
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
        const {Confirmed, Ttl} = res.TradingSession;
        if (Confirmed) {
          this.sessionConfirmed();
          if (Ttl) {
            this.ttl = Math.floor(Ttl / 1000);
          }
          if (this.ttl - SESSION_WARNING_REMAINING > 0) {
            this.runSessionNotificationTimeout();
          } else {
            this.showSessionNotification();
          }
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

  sessionConfirmed = () => {
    this.stopListenSessionConfirmationExpire();
    this.rootStore.uiStore.stopViewMode();
    this.rootStore.start();
  };

  showSessionNotification = () => {
    const currentDate = new Date().getTime();
    this.api
      .loadSessionNoteShown()
      .then((resp: any) => {
        const noteLastSeen = resp.Data;
        const timeDiff = Math.abs(currentDate - noteLastSeen);
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays > SESSION_NOTE_HIDDEN_DURATION) {
          this.saveSessionNoteShownDate(currentDate);
          this.isSessionNotesShown = true;
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
    this.timeTick();
    this.sessionRemainIntervalId = setInterval(() => {
      if (this.ttl < 1) {
        this.stopSessionRemains();
        this.closeSessionNotification();
        this.showViewModeNotification();
        this.rootStore.uiStore.runViewMode();
        this.rootStore.resetSubscriptions();
        this.rootStore.start();
        this.api.getSessionStatus().then((res: any) => {
          // tslint:disable-next-line:no-console
          console.log(res);
        });
        return;
      }
      this.timeTick();
    }, 1000);
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

  extendSession = () => {
    this.stopSessionRemains();
    this.ttl += this.sessionDuration / 1000;
    this.api.extendSession(this.ttl * 1000);
    this.runSessionNotificationTimeout();
  };

  stopSessionRemains = () => {
    clearInterval(this.sessionRemainIntervalId);
    this.sessionRemainIntervalId = null;
  };

  stopPollingSession = () => {
    clearInterval(this.pollingSessionTimerId);
    this.pollingSessionTimerId = null;
  };

  stopListenSessionConfirmationExpire = () => {
    clearInterval(this.sessionConfirmationExpireTimerId);
    this.sessionConfirmationExpireTimerId = null;
  };

  startTrade = () => {
    this.startSessionListener();
    this.closeViewModeNotification();
  };

  handleSetDuration = (value: number) => {
    this.sessionDuration = value * 60000;
    this.api.saveSessionDuration(this.sessionDuration);
  };

  reset = () => {
    this.stopSessionRemains();
    this.stopPollingSession();
    this.currentQrId = '';
  };
}

export default SessionStore;
