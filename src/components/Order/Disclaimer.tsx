import * as React from 'react';
import {Body, DisclaimerNotification, Title} from './styles';

export const Disclaimer = () => (
  <DisclaimerNotification>
    <Title>Attention</Title>
    <Body>
      Due to the EOS migration, deposits and withdrawals are disabled until
      further notice.
    </Body>
  </DisclaimerNotification>
);
