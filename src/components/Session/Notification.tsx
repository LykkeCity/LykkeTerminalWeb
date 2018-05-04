import * as React from 'react';
import CloseButton from '../CloseButton/CloseButton';
// tslint:disable-next-line:ordered-imports
import {
  ActionSessionButton,
  Body,
  Buttons,
  CloseBtnPosition,
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
  isSessionNotesShown: boolean;
}

interface NotificationConnectedProps {
  sessionRemain: number;
}

interface NotificationState {
  isNoteShown: boolean;
}

class Notification extends React.Component<
  NotificationProps & NotificationConnectedProps,
  NotificationState
> {
  constructor(props: NotificationProps & NotificationConnectedProps) {
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
    const {sessionRemain} = this.props;
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
          <Timer>
            &nbsp;00:{sessionRemain < 10 ? `0${sessionRemain}` : sessionRemain}&nbsp;
          </Timer>
          {!this.props.isSessionNotesShown && (
            <NoteMark onClick={this.handleToggleNotes}>?</NoteMark>
          )}
        </Body>
        {(this.props.isSessionNotesShown || this.state.isNoteShown) && (
          <Note>
            To ensure that no one uses your account while you are away, your
            session will be closed automatically if you don't click on
            "Continue" or proceed to an action. You can adjust the timing
            setting below.
          </Note>
        )}
        <Buttons>
          <ActionSessionButton onClick={this.props.onExtendingSession}>
            Continue session
          </ActionSessionButton>
          <SettingsButton onClick={this.props.onSettings}>
            Settings
          </SettingsButton>
        </Buttons>
      </SessionNotification>
    );
  }
}

export default Notification;
