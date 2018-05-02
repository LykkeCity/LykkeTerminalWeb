import * as React from 'react';
import ModalModel from '../../models/modalModel';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  GotButton,
  ImgLink,
  MarginedModalBody,
  ModalWrapper,
  Wrapper
} from './styles';

const ManageFundsModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  const handleCancel = (m: ModalModel) => () => {
    m.close();
  };

  return (
    <ModalWrapper>
      <ModalHeader onClick={handleCancel(modal)} />
      <MarginedModalBody>{modal.message.body}</MarginedModalBody>
      <Wrapper>
        <ImgLink
          href={modal.message.link.appStore}
          target={'_blank'}
          onClick={modal.close}
          image={'app-store'}
        />
        <ImgLink
          href={modal.message.link.playMarket}
          target={'_blank'}
          onClick={modal.close}
          image={'google-play'}
        />
      </Wrapper>
      <GotButton onClick={modal.close}>Got it!</GotButton>
    </ModalWrapper>
  );
};

export default ManageFundsModal;
