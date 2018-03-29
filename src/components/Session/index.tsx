import {connect} from '../connect';
import SessionNotificationComponent from './SessionNotification';

const ConnectedSessionNotification = connect(
  ({sessionStore: {getSessionNotesShown, closeSessionNotification}}) => ({
    isSessionNotesShown: getSessionNotesShown(),
    closeSessionNotification
  }),
  SessionNotificationComponent
);

export {ConnectedSessionNotification as SessionNotificationComponent};
