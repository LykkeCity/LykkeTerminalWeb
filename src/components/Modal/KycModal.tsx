import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import ModalModel from '../../models/modalModel';
import {Button, StyledModal} from './index';
import ModalHeader from './ModalHeader/ModalHeader';

const StyledModalHeader = styled(ModalHeader)`
  font-size: ${rem(24)};
`;

const StyledText = styled.div`
  margin-top: 16px;
  width: 312px;
  font-size: ${rem(16)};
  font-family: Proxima Nova;
  line-height: 1.5;
`;

const StyledApplications = styled.div`
  margin-top: 16px;
  width: 312px;
`;

const StyledAppStore = styled.div`
  display: block;
  background: url('assets/images/app-store.png') no-repeat center;
  height: 48px;
  width: 152px;
  float: left;
`;

const StyledGooglePlay = styled.div`
  display: block;
  margin-left: 156px;
  background: url('assets/images/google-play.png') no-repeat center;
  height: 48px;
  width: 152px;
`;

const StyledButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
  margin: 24px 0 8px 0;
  width: 312px;
`;

const KycModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  return (
    <StyledModal>
      <StyledModalHeader title={'Attention!'} onClick={modal.close} />
      <StyledText>
        To offer you the advanced range of services we need you to confirm your
        identity and pass KYC (Know Your Customer) procedure. You can pass the
        KYC in the Lykke Wallet app.
      </StyledText>
      <StyledApplications>
        <a href="https://itunes.apple.com/us/app/lykke-wallet/id1112839581">
          <StyledAppStore />
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet">
          <StyledGooglePlay />
        </a>
      </StyledApplications>
      <StyledButton onClick={modal.close}>Ok</StyledButton>
    </StyledModal>
  );
};

export default KycModal;
