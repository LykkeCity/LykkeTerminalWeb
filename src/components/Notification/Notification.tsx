import * as React from 'react';
import {
  NotificationCloseButton,
  NotificationMessage,
  NotificationTitle,
  StyledNotification
} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface NotificationProps {
  index: number;
  level: string;
  message: string;
  closeNotification: () => void;
}

const Notification: React.SFC<NotificationProps> = ({
  index,
  level,
  message,
  closeNotification
}) => {
  return (
    <StyledNotification level={level} key={index}>
      <Flex justify={'space-between'}>
        <NotificationTitle>{level}</NotificationTitle>
        <NotificationCloseButton href="#" onClick={closeNotification}>
          <span>&times;</span>
        </NotificationCloseButton>
      </Flex>
      <NotificationMessage>{message}</NotificationMessage>
    </StyledNotification>
  );
};

export default Notification;
