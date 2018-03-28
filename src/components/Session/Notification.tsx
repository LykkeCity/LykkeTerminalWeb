import * as React from 'react';
import CloseButton from '../CloseButton/CloseButton';
// tslint:disable-next-line:ordered-imports
import {
  Body,
  Button,
  CloseBtnPosition,
  SessionNotification,
  Timer,
  Title
} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface NotificationProps {
  onSettings: any;
  onExtendingSession: any;
  onNotificationClose: any;
}

const Notification: React.SFC<NotificationProps> = ({
  onSettings,
  onExtendingSession,
  onNotificationClose
}) => {
  return (
    <SessionNotification>
      <CloseButton
        onClose={onNotificationClose}
        top={CloseBtnPosition.top}
        right={CloseBtnPosition.right}
      />
      <Title>Attention</Title>
      <Body>
        Session will be expired in
        <Timer> 00:59</Timer>
      </Body>
      <Flex>
        <Button onClick={onExtendingSession}>Continue session</Button>
        <div onClick={onSettings}>Settings</div>
      </Flex>
    </SessionNotification>
  );
};

export default Notification;
