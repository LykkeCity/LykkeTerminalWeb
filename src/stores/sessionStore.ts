import {computed, observable} from 'mobx';
import uuid from 'uuid';
import {SessionApi} from '../api';
import ModalMessages from '../constants/modalMessages';
import {keys as storageKeys} from '../models';
import Types from '../models/modals';
import {StorageUtils} from '../utils/';
import {BaseStore, RootStore} from './index';

const SESSION_NOTE_HIDDEN_DURATION = 1;
const SESSION_REMAINS = 10;
const SESSION_WARNING_REMAINING = 60000; // 1 minute

const SESSION_POLLING = 10000; // 10 seconds

const sessionKickoffStorage = StorageUtils(storageKeys.sessionKickoff);
const sessionExpirationStorage = StorageUtils(storageKeys.sessionExpiration);

class SessionStore extends BaseStore {
  @computed
  get sessionNotificationShown() {
    return this.isSessionNotificationShown;
  }

  @computed
  get sessionRemain() {
    return this.sessionRemains;
  }

  @observable private isSessionNotificationShown: boolean = false;
  @observable private sessionRemains: number = SESSION_REMAINS;
  private currentQrId: string = '';
  private isSessionNotesShown: boolean = false;
  private sessionRemainIntervalId: any;
  private sessionPollingIntervalId: any;
  private sessionLastConfirmed: any = new Date(
    sessionKickoffStorage.get()!
  ).getTime();

  constructor(store: RootStore, private readonly api: SessionApi) {
    super(store);
  }

  fetchQrId = async () => {
    // const resp = await this.api.getQRConfirmation();
    // console.log(resp);
  };

  showQR = async () => {
    const QRModal = this.rootStore.modalStore.addModal(
      ModalMessages.qr,
      // tslint:disable-next-line:no-empty
      () => {},
      this.showSessionNotification,
      Types.QR
    );

    const pollingSessionTimerId = setInterval(() => {
      this.api.getSessionStatusMock().then((res: any) => {
        const {enabled, ttl} = res.terminal;
        if (enabled) {
          QRModal.close();
          clearInterval(pollingSessionTimerId);
          sessionKickoffStorage.set(new Date());
          sessionExpirationStorage.set(ttl);
          this.runPollingSession();
        }
      });
    }, 5000);
  };

  showSessionNotification = async (sessionRemains: number) => {
    const currentDate = new Date().getTime();
    this.api
      .loadSessionNoteShown()
      .then((resp: any) => {
        const noteLastSeen = resp.Data;
        const timeDiff = Math.abs(currentDate - noteLastSeen);
        const diffDays = Math.ceil(timeDiff / (1000 * 60));
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

  saveSessionNoteShownDate = (date: number) => {
    this.api.saveSessionNoteShown({
      Data: `${date}`
    });
  };

  closeSessionNotification = () => {
    this.isSessionNotificationShown = false;
  };

  getSessionNotesShown = () => {
    return this.isSessionNotesShown;
  };

  getQrId = () => {
    this.currentQrId = uuid.v4();
    return this.currentQrId;
  };

  runSessionRemains = (sessionRemains: number) => {
    let secondsRemains = Math.round(sessionRemains / 1000);
    this.sessionRemainIntervalId = setInterval(() => {
      if (secondsRemains < 1) {
        this.stopSessionRemains();
        this.showQR();
        this.closeSessionNotification();
        return;
      }
      secondsRemains = secondsRemains - 1;
    }, 1000);
  };

  stopSessionRemains = () => {
    clearInterval(this.sessionRemainIntervalId);
    this.sessionRemainIntervalId = null;
    this.sessionRemains = SESSION_REMAINS;
  };

  runPollingSession = () => {
    this.sessionPollingIntervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const sessionRemains = currentTime - this.sessionLastConfirmed;
      if (sessionRemains <= SESSION_WARNING_REMAINING) {
        this.showSessionNotification(sessionRemains);
        this.stopPollingSession();
      }
    }, SESSION_POLLING);
  };

  stopPollingSession = () => {
    clearInterval(this.sessionPollingIntervalId);
    this.sessionPollingIntervalId = null;
  };

  isSessionExpires = () => {
    const expiresIn = sessionExpirationStorage.get();
    const currentTime = new Date();
    if (
      currentTime.getTime() - new Date(this.sessionLastConfirmed!).getTime() >
      +expiresIn!
    ) {
      return true;
    }
    this.runPollingSession();
    return false;
  };

  reset = () => {
    this.currentQrId = '';
  };
}

export default SessionStore;
