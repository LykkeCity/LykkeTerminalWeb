import * as React from 'react';
import styled from 'styled-components';
import NotificationModel from '../../models/notificationModel';
import {NotificationListProps} from './index';
import Notification from './Notification';

const StyledNotificationList = styled.div`
  position: absolute;
  right: 15px;
  top: 30px;
  z-index: 999;
`;

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
