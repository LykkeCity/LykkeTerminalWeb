import * as React from 'react';
import ModalMessages from '../../constants/modalMessages';
import ModalModel from '../../models/modalModel';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  Modal,
  StyledApplications,
  StyledAppStore,
  StyledButton,
  StyledGooglePlay,
  StyledKycModalHeader,
  StyledText
} from './styles';

const KycModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  return (
    <Modal>
      <StyledKycModalHeader>
        <ModalHeader
          title={ModalMessages.missedKyc.title}
          onClick={modal.close}
        />
      </StyledKycModalHeader>
      <StyledText>{ModalMessages.missedKyc.body}</StyledText>
      <StyledApplications>
        <a href="https://itunes.apple.com/us/app/lykke-wallet/id1112839581">
          <StyledAppStore />
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet">
          <StyledGooglePlay />
        </a>
      </StyledApplications>
      <StyledButton onClick={modal.close}>Ok</StyledButton>
    </Modal>
  );
};

export default KycModal;
