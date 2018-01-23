import {connect} from '../connect';
import Notification from './Notification';

export interface NotificationProps {
  showNotification: boolean;
  closeNotification: any;
  level: string;
  message: string;
}

const connectedNotification = connect(
  ({
    notificationStore: {showNotification, closeNotification, level, message}
  }) => ({
    closeNotification,
    level,
    message,
    showNotification
  }),
  Notification
);

export {connectedNotification as Notification};
