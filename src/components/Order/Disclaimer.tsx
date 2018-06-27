import * as React from 'react';
import {disclaimerMessages} from '../../constants/assetDisclaimer';
import {Body, DisclaimerNotification, Link, Title} from './styles';

interface DisclaimerProps {
  asset: string;
}

export const Disclaimer: React.SFC<DisclaimerProps> = ({asset}) => {
  const content = disclaimerMessages[asset] || {};

  return (
    <DisclaimerNotification>
      <Title>Attention</Title>
      <Body>
        {content.message && <p>{content.message}</p>}
        {content.link && (
          <Link target="_blank" href={content.link}>
            Read more
          </Link>
        )}
      </Body>
    </DisclaimerNotification>
  );
};
