import levels from '../../constants/notificationLevels';
import messages from '../../constants/notificationMessages';
import {NotificationStore, RootStore} from '../index';

describe('notification store', () => {
  let notificationStore: NotificationStore;

  beforeEach(() => {
    notificationStore = new NotificationStore(new RootStore(false));
  });

  it('should contain showNotification field with false as default value', () => {
    expect(notificationStore.showNotification).toBeDefined();
    expect(notificationStore.showNotification).toBeFalsy();
  });

  it('has closeNotification set showNotification value to false', () => {
    notificationStore.showNotification = true;
    expect(notificationStore.showNotification).toBeTruthy();
    notificationStore.closeNotification();
    expect(notificationStore.showNotification).toBeFalsy();
  });

  it('should contain fields level and message with empty string as default values', () => {
    expect(notificationStore.level).toBe('');
    expect(notificationStore.message).toBe('');
  });

  it('has addNotification that updated level, message and showNotification', () => {
    expect(notificationStore.level).toBe('');
    expect(notificationStore.message).toBe('');
    expect(notificationStore.showNotification).toBeFalsy();
    notificationStore.addNotification(
      levels.information,
      messages.orderCanceled
    );
    expect(notificationStore.level).toBe(levels.information);
    expect(notificationStore.message).toBe(messages.orderCanceled);
    expect(notificationStore.showNotification).toBeTruthy();
  });
});
