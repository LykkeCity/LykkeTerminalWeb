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

const ManageFundsModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  const handleCancel = () => {
    modal.close();
  };

  return (
    <ModalWrapper>
      <ModalHeader onClick={handleCancel} />
      <MarginedModalBody>{modal.message.body}</MarginedModalBody>
      <ModalContentWrapper>
        <MobileAppLink
          href={modal.message.link.appStore}
          target={'_blank'}
          onClick={modal.close}
          image={'app-store'}
        />
        <MobileAppLink
          href={modal.message.link.playMarket}
          target={'_blank'}
          onClick={modal.close}
          image={'google-play'}
        />
      </ModalContentWrapper>
      <OkButton onClick={handleCancel}>Got it!</OkButton>
    </ModalWrapper>
  );
};

export default ManageFundsModal;
