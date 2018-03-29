import {connect} from '../connect';
import Notification from './Notification';
import SessionNotificationComponent from './SessionNotification';

const ConnectedSessionNotification = connect(
  ({sessionStore: {getSessionNotesShown, closeSessionNotification}}) => ({
    isSessionNotesShown: getSessionNotesShown(),
    closeSessionNotification
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
