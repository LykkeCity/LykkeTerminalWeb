import {connect} from '../connect';
import NotificationList, {NotificationListProps} from './NotificationList';

const connectedNotificationList = connect<NotificationListProps>(
  ({notificationStore: {notificationLists, closeNotification}}) => ({
    closeNotification,
    notificationLists
  }),
  NotificationList
);

export {connectedNotificationList as NotificationList};
