import * as React from 'react';
import {NotAuthorized} from './';

interface AuthProps {
  isAuth?: boolean;
}

const withAuth = <P extends {}>(Component: React.ComponentType<P>) => ({
  isAuth,
  ...props
}: AuthProps & any) => (isAuth ? <Component {...props} /> : <NotAuthorized />);

export default withAuth;
