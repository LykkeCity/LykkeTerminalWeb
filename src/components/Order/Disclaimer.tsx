import * as React from 'react';
import {Body, DisclaimerNotification, Link, Title} from './styles';

export const Disclaimer = () => (
  <DisclaimerNotification>
    <Title>Attention</Title>
    <Body>
      <p>
        Due to the EOS migration, deposits and withdrawals are disabled until
        further notice.
      </p>
      <Link
        target="_blank"
        href="https://www.lykke.com/company/news/2018-05-eos-mainnet-swap"
      >
        Read more
      </Link>
    </Body>
  </DisclaimerNotification>
);
