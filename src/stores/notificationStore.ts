import {observable} from 'mobx';
import Notifications from '../models/notification';
import NotificationModel from '../models/notificationModel';
import {BaseStore, RootStore} from './index';

class NotificationStore extends BaseStore {
  @observable notificationLists: NotificationModel[] = [];

  constructor(store: RootStore) {
    super(store);
  }

  addNotification = (level: string, message: string) => {
    const notification = new NotificationModel(
      level,
      message,
      (self: NotificationModel) => this.closeNotification(self)
    );
    this.notificationLists = [...this.notificationLists, ...[notification]];
    if (this.notificationLists.length > Notifications.MaxNotifications) {
      this.closeNotification(this.notificationLists[0]);
    }
  };

  closeNotification = (notification: NotificationModel) => {
    const index = this.notificationLists.indexOf(notification);
    this.notificationLists.splice(index, 1);
  };

  reset = () => {
    return;
  };
}

export default NotificationStore;
