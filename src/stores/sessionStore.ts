import {computed, observable} from 'mobx';
import uuid from 'uuid';
import {SessionApi} from '../api';
import ModalMessages from '../constants/modalMessages';
import Types from '../models/modals';
import {BaseStore, RootStore} from './index';

const SESSION_NOTE_HIDDEN_DURATION = 30;
const SESSION_REMAINS = 59;
const SESSION_WARNING_REMAINING = 60000; // 1 minute

class SessionStore extends BaseStore {
  @computed
  get sessionNotificationsBlockShown() {
    return (
      this.isSessionNotificationShown ||
      this.isViewModeNotificationFullShown ||
      this.isViewModeNotificationCutShown
    );
  }

  @computed
  get sessionNotificationShown() {
    return this.isSessionNotificationShown;
  }

  @computed
  get viewModeNotificationFullShown() {
    return this.isViewModeNotificationFullShown;
  }

  @computed
  get viewModeNotificationCutShown() {
    return this.isViewModeNotificationCutShown;
  }

  @computed
  get sessionRemain() {
    return this.sessionRemains;
  }

  @observable private isSessionNotificationShown: boolean = false;
  @observable private isViewModeNotificationFullShown: boolean = false;
  @observable private isViewModeNotificationCutShown: boolean = false;
  @observable private sessionRemains: number = 0;
  private currentQrId: string = '';
  private isSessionNotesShown: boolean = false;
  private sessionRemainIntervalId: any;
  private pollingSessionTimerId: any;

  constructor(store: RootStore, private readonly api: SessionApi) {
    super(store);
  }

  initUserSession = async () => {
    const session = await this.api.getSessionStatusMock(false, 50000);
    const {enabled, ttl} = session.terminal;
    if (!enabled) {
      // const qrId = await this.api.getQrId();
      // console.log(qrId);
      this.showQR();
      return;
    }
    if (ttl - SESSION_WARNING_REMAINING > 0) {
      this.runSessionNotificationTimeout(ttl - SESSION_WARNING_REMAINING);
    } else {
      this.showSessionNotification(ttl / 1000);
    }
  };

  runSessionNotificationTimeout = (start: number) => {
    const timeoutId = setTimeout(() => {
      this.showSessionNotification(SESSION_REMAINS);
      clearTimeout(timeoutId);
    }, start);
  };

  showQR = async () => {
    const QRModal = this.rootStore.modalStore.addModal(
      ModalMessages.qr,
      this.rootStore.uiStore.runViewMode,
      this.showSessionNotification,
      Types.QR
    );

    this.pollingSessionTimerId = setInterval(() => {
      this.api.getSessionStatusMock(true, 120000).then((res: any) => {
        const {enabled, ttl} = res.terminal;
        if (enabled) {
          if (ttl - SESSION_WARNING_REMAINING > 0) {
            this.runSessionNotificationTimeout(ttl - SESSION_WARNING_REMAINING);
          } else {
            this.showSessionNotification(ttl / 1000);
          }
          this.stopPollingSession();
          QRModal.close();
        }
      });
    }, 15000);
  };

  showSessionNotification = async (sessionRemains: number) => {
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
        this.runSessionRemains(sessionRemains);
      })
      .catch(() => {
        this.saveSessionNoteShownDate(currentDate);
        this.isSessionNotesShown = true;
        this.isSessionNotificationShown = true;
        this.runSessionRemains(sessionRemains);
      });
  };

  runSessionRemains = (sessionRemains: number) => {
    this.sessionRemains = sessionRemains;
    this.sessionRemainIntervalId = setInterval(() => {
      if (this.sessionRemains < 1) {
        this.stopSessionRemains();
        this.closeSessionNotification();
        this.rootStore.uiStore.runViewMode();
        return;
      }
      this.sessionRemains = this.sessionRemains - 1;
    }, 1000);
  };

  saveSessionNoteShownDate = (date: number) => {
    this.api.saveSessionNoteShown({
      Data: `${date}`
    });
  };

  closeSessionNotification = () => {
    this.isSessionNotificationShown = false;
  };

  showViewModeFullNotification = () => {
    this.stopPollingSession();
    this.isViewModeNotificationFullShown = true;
  };

  closeViewModeFullNotification = () => {
    this.isViewModeNotificationFullShown = false;
    this.showViewModeCutNotification();
  };

  showViewModeCutNotification = () => {
    this.isViewModeNotificationCutShown = true;
  };

  closeViewModeCutNotification = () => {
    this.isViewModeNotificationCutShown = false;
  };

  getSessionNotesShown = () => {
    return this.isSessionNotesShown;
  };

  getQrId = () => {
    this.currentQrId = uuid.v4();
    return this.currentQrId;
  };

  extendSession = () => {
    this.stopSessionRemains();
  };

  stopSessionRemains = () => {
    clearInterval(this.sessionRemainIntervalId);
    this.sessionRemainIntervalId = null;
    this.sessionRemains = SESSION_REMAINS;
  };

  stopPollingSession = () => {
    clearInterval(this.pollingSessionTimerId);
    this.pollingSessionTimerId = null;
  };

  reset = () => {
    this.stopSessionRemains();
    this.stopPollingSession();
    this.currentQrId = '';
  };
}

export default SessionStore;
