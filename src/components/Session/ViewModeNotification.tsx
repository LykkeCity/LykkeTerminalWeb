import * as React from 'react';
import CloseButton from '../CloseButton/CloseButton';
import {
  ActionSessionButton,
  Body,
  Buttons,
  CloseBtnPosition,
  Title,
  ViewModeNotification
} from './styles';

interface ViewModeNotificationProps {
  onNotificationClose: () => {};
  onStartTrade: () => {};
}

const ViewModeNotificationComponent: React.SFC<ViewModeNotificationProps> = ({
  onNotificationClose,
  onStartTrade
}) => (
  <ViewModeNotification>
    <CloseButton
      onClose={onNotificationClose}
      top={CloseBtnPosition.top}
      right={CloseBtnPosition.right}
    />
    <Title>Attention</Title>
    <Body>You are using the terminal in a view mode</Body>
    <Buttons>
      <ActionSessionButton onClick={onStartTrade}>
        Start trade
      </ActionSessionButton>
    </Buttons>
  </ViewModeNotification>
);

export default ViewModeNotificationComponent;
