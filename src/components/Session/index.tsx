import {connect} from '../connect';
import SessionNotificationComponent from './SessionNotification';

const ConnectedSessionNotification = connect(
  ({uiStore: {toggleSessionNotification}}) => ({
    toggleSessionNotification
  }),
  SessionNotificationComponent
);

export {ConnectedSessionNotification as SessionNotificationComponent};
