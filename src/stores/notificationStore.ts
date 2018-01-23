import {observable} from 'mobx';
import timeouts from '../constants/timeouts';
import {BaseStore, RootStore} from './index';

class NotificationStore extends BaseStore {
  @observable showNotification: boolean = false;
  level: string = '';
  message: string = '';

  constructor(store: RootStore) {
    super(store);
  }

  addNotification = (level: string, message: string) => {
    this.level = level;
    this.message = message;
    this.showNotification = true;
    setTimeout(() => {
      if (this.showNotification) {
        this.closeNotification();
      }
    }, timeouts.notificationClose);
  };

  closeNotification = () => {
    this.showNotification = false;
  };

  reset = () => {
    return;
  };
}

export default NotificationStore;
