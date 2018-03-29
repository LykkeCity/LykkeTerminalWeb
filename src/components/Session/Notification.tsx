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
  isSessionNotesShown: boolean;
  showQR: () => {};
}

interface NotificationState {
  isNoteShown: boolean;
  seconds: number;
}

class Notification extends React.Component<
  NotificationProps,
  NotificationState
> {
  private intervalId: any;

  constructor(props: NotificationProps) {
    super(props);
    this.state = {
      isNoteShown: false,
      seconds: 10
    };
  }

  componentDidMount() {
    this.runTimeout();
  }

  componentWillUnmount() {
    this.stopTimeout();
  }

  runTimeout = () => {
    this.intervalId = setInterval(() => {
      if (this.state.seconds < 0) {
        return;
      }
      if (this.state.seconds < 1) {
        this.stopTimeout();
        this.props.showQR();
        this.props.onNotificationClose();
        return;
      }
      this.setState({
        seconds: this.state.seconds - 1
      });
    }, 1000);
  };

  stopTimeout = () => {
    clearInterval(this.intervalId);
    this.intervalId = null;
  };

  handleToggleNotes = () => {
    this.setState({
      isNoteShown: !this.state.isNoteShown
    });
  };

  render() {
    const {seconds} = this.state;
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
          <Timer>&nbsp;00:{seconds < 10 ? `0${seconds}` : seconds}&nbsp;</Timer>
          {!this.props.isSessionNotesShown && (
            <NoteMark onClick={this.handleToggleNotes}>?</NoteMark>
          )}
        </Body>
        {(this.props.isSessionNotesShown || this.state.isNoteShown) && (
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
