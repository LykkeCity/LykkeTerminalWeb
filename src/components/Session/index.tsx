import {connect} from '../connect';
import Notification from './Notification';
import SessionNotificationComponent from './SessionNotification';

const ConnectedSessionNotification = connect(
  ({
    sessionStore: {
      getSessionNotesShown,
      closeSessionNotification,
      extendSession,
      showQR,
      closeViewModeNotification,
      viewModeNotificationShown,
      sessionNotificationShown,
      startTrade,
      handleSetDuration,
      sessionCurrentDuration
    }
  }) => ({
    closeViewModeNotification,
    extendSession,
    isSessionNotesShown: getSessionNotesShown(),
    closeSessionNotification,
    showQR,
    viewModeNotificationShown,
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
