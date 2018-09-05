import * as React from 'react';
import NotificationModel from '../../models/notificationModel';
import Notification from './Notification';
import {StyledNotificationList} from './styles';

export interface NotificationListProps {
  notificationLists: NotificationModel[];
  closeNotification: (notification: NotificationModel) => void;
}

class NotificationList extends React.Component<NotificationListProps> {
  constructor(props: NotificationListProps) {
    super(props);
  }

  closeNotification = (notification: NotificationModel) => () => {
    this.props.closeNotification(notification);
  };

  render() {
    const {notificationLists} = this.props;
    return (
      <StyledNotificationList>
        {notificationLists.map(
          (notification: NotificationModel, index: number) => {
            return (
              <Notification
                key={index}
                index={index}
                level={notification.level}
                message={notification.message}
                closeNotification={this.closeNotification(notification)}
              />
            );
          }
        )}
      </StyledNotificationList>
    );
  }
}

export default NotificationList;
