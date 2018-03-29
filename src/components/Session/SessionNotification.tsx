import * as React from 'react';
import Notification from './Notification';
import Settings from './Settings';
import {SessionNotificationBlock} from './styles';

interface SessionNotificationState {
  isSettingsShown: boolean;
}

interface SessionNotificationProps {
  isSessionNotesShown: boolean;
  closeSessionNotification: () => {};
}

class SessionNotificationComponent extends React.Component<
  SessionNotificationProps,
  SessionNotificationState
> {
  constructor(props: SessionNotificationProps) {
    super(props);
    this.state = {
      isSettingsShown: false
    };
  }

  handleSettings = () => {
    this.setState({
      isSettingsShown: true
    });
  };

  handleSettingsClose = () => {
    this.setState({
      isSettingsShown: false
    });
  };

  handleNotificationClose = () => {
    this.props.closeSessionNotification();
    this.setState({
      isSettingsShown: false
    });
  };

  handleExtendingSession = () => {
    // tslint:disable-next-line:no-console
    console.log('extend session');
  };

  render() {
    return (
      <SessionNotificationBlock>
        <Notification
          onSettings={this.handleSettings}
          onExtendingSession={this.handleExtendingSession}
          onNotificationClose={this.handleNotificationClose}
          isSessionNotesShown={this.props.isSessionNotesShown}
        />
        {this.state.isSettingsShown && (
          <Settings onSettingsClose={this.handleSettingsClose} />
        )}
      </SessionNotificationBlock>
    );
  }
}

export default SessionNotificationComponent;
