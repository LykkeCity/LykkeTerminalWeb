import * as React from 'react';
import ModalModel from '../../models/modalModel';
import {Modal, ModalBody, ModalTitle, QRButton} from './styles';

const QRModal: React.SFC<{modal: ModalModel}> = ({modal}) => {
  const handleContinue = () => {
    // modal.cancelAction();
    modal.close();
  };

  return (
    <Modal>
      <ModalTitle>{modal.message.title}</ModalTitle>
      <ModalBody>{modal.message.body}</ModalBody>
      <QRButton onClick={handleContinue}>{modal.message.button}</QRButton>
    </Modal>
  );
};

export default QRModal;
