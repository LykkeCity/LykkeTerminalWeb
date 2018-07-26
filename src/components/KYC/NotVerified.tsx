import * as React from 'react';
import {Centered, Link, NotVerifiedContainer} from './styles';

interface NotVerifiedProps {
  href: string;
}

const NotVerified: React.SFC<NotVerifiedProps> = ({href}) => (
  <NotVerifiedContainer>
    <Centered>
      <Link className="btn" href={href}>
        Get verified
      </Link>{' '}
      and start trading
    </Centered>
  </NotVerifiedContainer>
);

export default NotVerified;
