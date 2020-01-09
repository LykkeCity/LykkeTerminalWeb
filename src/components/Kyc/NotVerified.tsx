import * as React from 'react';
import {Centered, Link, NotVerifiedContainer, Text} from './styles';

interface NotVerifiedProps {
  href: string;
}

const NotVerified: React.SFC<NotVerifiedProps> = ({href}) => (
  <NotVerifiedContainer>
    <Centered>
      <Link className="btn" href={href}>
        Upgrade your account
      </Link>{' '}
      <Text>and start trading</Text>
    </Centered>
  </NotVerifiedContainer>
);

export default NotVerified;
