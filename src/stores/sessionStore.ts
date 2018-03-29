import {computed, observable} from 'mobx';
import uuid from 'uuid';
import {SessionApi} from '../api';
import ModalMessages from '../constants/modalMessages';
import Types from '../models/modals';
import {BaseStore, RootStore} from './index';

const SESSION_NOTE_HIDDEN_DURATION = 1;

class SessionStore extends BaseStore {
  @computed
  get sessionNotificationShown() {
    return this.isSessionNotificationShown;
  }

  private currentSessionString: string = '';
  @observable private isSessionNotificationShown: boolean = false;
  private isSessionNotesShown: boolean = false;

  constructor(store: RootStore, private readonly api: SessionApi) {
    super(store);
  }

  showQR = async () => {
    this.rootStore.modalStore.addModal(
      ModalMessages.qr,
      // tslint:disable-next-line:no-empty
      () => {},
      this.showSessionNotification,
      Types.QR
    );
  };

  showSessionNotification = async () => {
    const currentDate = new Date().getTime();
    this.api
      .loadSessionNoteShown()
      .then(resp => {
        const noteLastSeen = resp.Data;
        const timeDiff = Math.abs(currentDate - noteLastSeen);
        const diffDays = Math.ceil(timeDiff / (1000 * 60));
        if (diffDays > SESSION_NOTE_HIDDEN_DURATION) {
          this.saveSessionNoteShownDate(currentDate);
          this.isSessionNotesShown = true;
        }
        this.isSessionNotificationShown = true;
      })
      .catch(() => {
        this.saveSessionNoteShownDate(currentDate);
        this.isSessionNotificationShown = true;
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

  getSessionString = () => {
    this.currentSessionString = uuid.v4();
    return this.currentSessionString;
  };

  clearSessionString = () => {
    this.currentSessionString = '';
  };

  reset = () => {
    this.currentSessionString = '';
  };
}

export default SessionStore;
