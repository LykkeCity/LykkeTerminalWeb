import * as React from 'react';
import {Centered, Link} from './styles';

interface NotAuthorizedProps {
  signIn: () => void;
}

const NotAuthorized: React.SFC<NotAuthorizedProps> = ({signIn}) => (
  <Centered>
    <Link onClick={signIn}>Connect</Link>&nbsp;to start trading
  </Centered>
);

export default NotAuthorized;
