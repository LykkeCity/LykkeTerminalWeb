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
      closeViewModeFullNotification,
      viewModeNotificationFullShown,
      viewModeNotificationCutShown,
      sessionNotificationShown
    }
  }) => ({
    closeViewModeFullNotification,
    extendSession,
    isSessionNotesShown: getSessionNotesShown(),
    closeSessionNotification,
    showQR,
    viewModeNotificationFullShown,
    viewModeNotificationCutShown,
    sessionNotificationShown
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
