import {connect} from '../connect';
import NotAuthorized from './NotAuthorized';

const ConnectedNotAuthorized = connect(
  ({authStore: {signIn}}) => ({
    signIn
  }),
  NotAuthorized
);

export {default as Auth} from './Auth';
export {ConnectedNotAuthorized as NotAuthorized};
export {default as withAuth} from './withAuth';
