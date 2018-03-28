import * as React from 'react';
import CloseButton from '../CloseButton/CloseButton';
// tslint:disable-next-line:ordered-imports
import {
  Body,
  Buttons,
  CloseBtnPosition,
  ExtendSessionButton,
  Note,
  NoteMark,
  SessionNotification,
  SettingsButton,
  Timer,
  Title
} from './styles';

interface NotificationProps {
  onSettings: any;
  onExtendingSession: any;
  onNotificationClose: any;
}

interface NotificationState {
  isNoteShown: boolean;
}

class Notification extends React.Component<
  NotificationProps,
  NotificationState
> {
  constructor(props: NotificationProps) {
    super(props);
    this.state = {
      isNoteShown: false
    };
  }

  handleToggleNotes = () => {
    this.setState({
      isNoteShown: !this.state.isNoteShown
    });
  };

  render() {
    return (
      <SessionNotification>
        <CloseButton
          onClose={this.props.onNotificationClose}
          top={CloseBtnPosition.top}
          right={CloseBtnPosition.right}
        />
        <Title>Attention</Title>
        <Body>
          Session will be expired in
          <Timer>&nbsp;00:59&nbsp;</Timer>
          <NoteMark onClick={this.handleToggleNotes}>?</NoteMark>
        </Body>
        {this.state.isNoteShown && (
          <Note>
            To ensure that no ones your account while you are away, your session
            will be closed automatically if you don't click on "Continue" or
            proceed to an action. You can adjust the timing setting below.
          </Note>
        )}
        <Buttons>
          <ExtendSessionButton onClick={this.props.onExtendingSession}>
            Continue session
          </ExtendSessionButton>
          <SettingsButton onClick={this.props.onSettings}>
            Settings
          </SettingsButton>
        </Buttons>
      </SessionNotification>
    );
  }
}

export default Notification;
