import NotificationModel from '../../models/notificationModel';
import {connect} from '../connect';
import NotificationList from './NotificationList';

export interface NotificationListProps {
  notificationLists: NotificationModel[];
  closeNotification: any;
}

export interface NotificationProps {
  index: number;
  level: string;
  message: string;
  closeNotification: any;
}

const connectedNotificationList = connect(
  ({notificationStore: {notificationLists, closeNotification}}) => ({
    closeNotification,
    notificationLists
  }),
  NotificationList
);

export {connectedNotificationList as NotificationList};
