import * as React from 'react';
import withReadOnlyMode from '../withReadOnlyMode/withReadOnlyMode';
import {NotAuthorized} from './';

interface AuthProps {
  isAuth?: boolean;
}

const withAuth = <P extends {}>(Component: React.ComponentType<P>) => ({
  isAuth,
  ...props
}: AuthProps & any) =>
  isAuth ? withReadOnlyMode(Component)(props) : <NotAuthorized />;

export default withAuth;
