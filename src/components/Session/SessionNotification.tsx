import * as React from 'react';
import {Notification} from './';
import ReadOnlyModeNotificationComponent from './ReadOnlyModeNotification';
import Settings from './Settings';
import {SessionNotificationBlock} from './styles';

interface SessionNotificationState {
  isSettingsShown: boolean;
}

interface SessionNotificationProps {
  isSessionNotesShown: boolean;
  closeSessionNotification: () => {};
  extendSession: () => {};
  startSessionListener: () => Promise<any>;
  closeReadOnlyModeNotification: () => {};
  readOnlyModeNotificationShown: boolean;
  sessionNotificationShown: boolean;
  startTrade: () => {};
  handleSetDuration: () => {};
  sessionCurrentDuration: number;
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
  };

  handleExtendingSession = () => {
    this.props.extendSession();
    this.handleNotificationClose();
  };

  render() {
    return (
      <SessionNotificationBlock>
        {this.props.sessionNotificationShown && (
          <Notification
            onSettings={this.handleSettings}
            onExtendingSession={this.handleExtendingSession}
            onNotificationClose={this.handleNotificationClose}
            isSessionNotesShown={this.props.isSessionNotesShown}
          />
        )}
        {this.props.readOnlyModeNotificationShown && (
          <ReadOnlyModeNotificationComponent
            onNotificationClose={this.props.closeReadOnlyModeNotification}
            onStartTrade={this.props.startTrade}
          />
        )}
        {this.state.isSettingsShown && (
          <Settings onSettingsClose={this.handleSettingsClose} />
        )}
      </SessionNotificationBlock>
    );
  }
}

export default SessionNotificationComponent;
