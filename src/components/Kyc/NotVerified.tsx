import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import AnalyticsService from '../../services/analyticsService';
import {Centered, Link, NotVerifiedContainer, Text} from './styles';

interface NotVerifiedProps {
  href: string;
}

const NotVerified: React.SFC<NotVerifiedProps> = ({href}) => {
  const onClick = () => {
    AnalyticsService.track(AnalyticsEvents.StartTierUpgrade);
  };
  return (
    <NotVerifiedContainer>
      <Centered>
        <Link className="btn" href={href} onClick={onClick}>
          Upgrade your account
        </Link>{' '}
        <Text>and start trading</Text>
      </Centered>
    </NotVerifiedContainer>
  );
};

export default NotVerified;
