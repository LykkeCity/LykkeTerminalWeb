import * as React from 'react';
import CloseButton from '../CloseButton/CloseButton';
import {
  ActionSessionButton,
  Body,
  Buttons,
  CloseBtnPosition,
  ReadOnlyModeNotification,
  Title
} from './styles';

interface ReadOnlyModeNotificationProps {
  onNotificationClose: () => {};
  onStartTrade: () => {};
}

const ReadOnlyModeNotificationComponent: React.SFC<
  ReadOnlyModeNotificationProps
> = ({onNotificationClose, onStartTrade}) => (
  <ReadOnlyModeNotification>
    <CloseButton
      onClose={onNotificationClose}
      top={CloseBtnPosition.top}
      right={CloseBtnPosition.right}
    />
    <Title>Attention</Title>
    <Body>You are using the terminal in a read-only mode</Body>
    <Buttons>
      <ActionSessionButton onClick={onStartTrade}>
        Start trading
      </ActionSessionButton>
    </Buttons>
  </ReadOnlyModeNotification>
);

export default ReadOnlyModeNotificationComponent;
