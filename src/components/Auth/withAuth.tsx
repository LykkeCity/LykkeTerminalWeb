import * as React from 'react';
import withViewMode from '../withViewMode/withViewMode';
import {NotAuthorized} from './';

interface AuthProps {
  isAuth?: boolean;
}

const withAuth = <P extends {}>(Component: React.ComponentType<P>) => ({
  isAuth,
  ...props
}: AuthProps & any) =>
  isAuth ? withViewMode(Component)(props) : <NotAuthorized />;

export default withAuth;
