import {connect} from '../connect';
import Notification from './Notification';
import SessionNotificationComponent from './SessionNotification';

const ConnectedSessionNotification = connect(
  ({
    sessionStore: {
      getSessionNotesShown,
      closeSessionNotification,
      extendSession,
      startSessionListener,
      closeReadOnlyModeNotification,
      readOnlyModeNotificationShown,
      sessionNotificationShown,
      startTrade,
      handleSetDuration,
      sessionCurrentDuration
    }
  }) => ({
    closeReadOnlyModeNotification,
    extendSession,
    isSessionNotesShown: getSessionNotesShown(),
    closeSessionNotification,
    startSessionListener,
    readOnlyModeNotificationShown,
    sessionNotificationShown,
    startTrade,
    handleSetDuration,
    sessionCurrentDuration
  }),
  SessionNotificationComponent
);

const ConnectedNotification = connect(
  ({sessionStore: {sessionRemain}}) => ({
    sessionRemain
  }),
  Notification
);

export {ConnectedSessionNotification as SessionNotificationComponent};
export {ConnectedNotification as Notification};
