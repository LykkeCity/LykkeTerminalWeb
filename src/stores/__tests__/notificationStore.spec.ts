import messages from '../../constants/notificationMessages';
import {levels} from '../../models';
import NotificationModel from '../../models/notificationModel';
import {NotificationStore, RootStore} from '../index';

describe('notification store', () => {
  let notificationStore: NotificationStore;

  beforeEach(() => {
    notificationStore = new NotificationStore(new RootStore(false));
  });

  it('should contain notificationLists as an empty array', () => {
    expect(notificationStore.notificationLists).toBeDefined();
    expect(notificationStore.notificationLists.length).toBe(0);
  });

  it('should add notification to the list', () => {
    notificationStore.addNotification(
      levels.information,
      messages.orderSuccess
    );
    expect(notificationStore.notificationLists.length).toBe(1);
    expect(
      notificationStore.notificationLists[0] instanceof NotificationModel
    ).toBeTruthy();
  });

  it('should remove notification from list', () => {
    notificationStore.addNotification(
      levels.information,
      messages.orderSuccess
    );
    expect(notificationStore.notificationLists.length).toBe(1);
    notificationStore.closeNotification(notificationStore.notificationLists[0]);
    expect(notificationStore.notificationLists.length).toBe(0);
  });
});
