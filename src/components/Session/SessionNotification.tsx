import * as React from 'react';
import {Notification} from './';
import Settings from './Settings';
import {SessionNotificationBlock} from './styles';
import ViewModeNotificationComponent from './ViewModeNotification';

interface SessionNotificationState {
  isSettingsShown: boolean;
}

interface SessionNotificationProps {
  isSessionNotesShown: boolean;
  closeSessionNotification: () => {};
  extendSession: () => {};
  showQR: () => Promise<any>;
  closeViewModeFullNotification: () => {};
  viewModeNotificationFullShown: boolean;
  viewModeNotificationCutShown: boolean;
  sessionNotificationShown: boolean;
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
        {this.props.viewModeNotificationFullShown && (
          <ViewModeNotificationComponent
            onNotificationClose={this.props.closeViewModeFullNotification}
            onStartTrade={this.props.showQR}
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
