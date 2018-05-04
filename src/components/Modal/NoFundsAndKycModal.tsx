import * as React from 'react';
import ModalModel from '../../models/modalModel';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  MarginedModalBody,
  MobileAppLink,
  ModalContentWrapper,
  ModalWrapper,
  OkButton
} from './styles';

interface NoFundsAndKycModalProps {
  modal: ModalModel;
  signOut: any;
}

const NoFundsAndKycModal: React.SFC<NoFundsAndKycModalProps> = ({
  modal: {message},
  signOut
}) => {
  const closeModal = (redirect?: string) => {
    const link = typeof redirect === 'string' ? redirect : '';
    signOut(link);
  };
  const goToLykke = () => closeModal(message.link.lykke);

  return (
    <ModalWrapper>
      <ModalHeader onClick={closeModal}>{message.title}</ModalHeader>
      <MarginedModalBody>{message.body}</MarginedModalBody>
      <ModalContentWrapper>
        <MobileAppLink
          href={message.link.appStore}
          target={'_blank'}
          onClick={closeModal}
          image={'app-store'}
        />
        <MobileAppLink
          href={message.link.playMarket}
          target={'_blank'}
          onClick={closeModal}
          image={'google-play'}
        />
      </ModalContentWrapper>
      <OkButton onClick={goToLykke}>Got it!</OkButton>
    </ModalWrapper>
  );
};

export default NoFundsAndKycModal;
