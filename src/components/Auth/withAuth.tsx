import * as React from 'react';
import withReadOnlyMode from '../withReadOnlyMode/withReadOnlyMode';

interface AuthProps {
  isAuth?: boolean;
}

const withAuth = <P extends {}>(Component: React.ComponentType<P>) => ({
  isAuth,
  ...props
}: AuthProps & any) => (isAuth ? withReadOnlyMode(Component)(props) : null);

export default withAuth;
