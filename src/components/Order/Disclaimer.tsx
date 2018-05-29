import * as React from 'react';
import {Body, DisclaimerNotification, Title} from './styles';

class Disclaimer extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <DisclaimerNotification>
        <Title>Attention!</Title>
        <Body>
          Due to the EOS migration, deposits and withdrawals are disabled until
          further notice.
        </Body>
      </DisclaimerNotification>
    );
  }
}

export default Disclaimer;
