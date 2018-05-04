import * as React from 'react';
import ModalMessages from '../../constants/modalMessages';
import ModalHeader from '../Modal/ModalHeader/ModalHeader';
import {
  KycAndFundsBack,
  MarginedModalBody,
  MobileAppLink,
  ModalContentWrapper,
  ModalWrapper,
  OkButton
} from '../Modal/styles';

interface NoFundsAndKycModalProps {
  signOut: any;
}

const KycAndFundsCheck: React.SFC<NoFundsAndKycModalProps> = ({signOut}) => {
  const closeModal = (redirect?: string) => {
    const link = typeof redirect === 'string' ? redirect : '';
    signOut(link);
  };
  const goToLykke = () => closeModal(ModalMessages.NoFundsAndKyc.link.lykke);

  return (
    <KycAndFundsBack>
      <ModalWrapper>
        <ModalHeader onClick={closeModal}>
          {ModalMessages.NoFundsAndKyc.title}
        </ModalHeader>
        <MarginedModalBody>
          {ModalMessages.NoFundsAndKyc.body}
        </MarginedModalBody>
        <ModalContentWrapper>
          <MobileAppLink
            href={ModalMessages.NoFundsAndKyc.link.appStore}
            target={'_blank'}
            onClick={closeModal}
            image={'app-store'}
          />
          <MobileAppLink
            href={ModalMessages.NoFundsAndKyc.link.playMarket}
            target={'_blank'}
            onClick={closeModal}
            image={'google-play'}
          />
        </ModalContentWrapper>
        <OkButton onClick={goToLykke}>Got it!</OkButton>
      </ModalWrapper>
    </KycAndFundsBack>
  );
};

export default KycAndFundsCheck;
