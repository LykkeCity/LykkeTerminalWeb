import {connect} from '../connect';
import SessionNotificationComponent from './SessionNotification';

const ConnectedSessionNotification = connect(
  ({
    sessionStore: {getSessionNotesShown, closeSessionNotification, showQR}
  }) => ({
    isSessionNotesShown: getSessionNotesShown(),
    closeSessionNotification,
    showQR
  }),
  SessionNotificationComponent
);

export {ConnectedSessionNotification as SessionNotificationComponent};
