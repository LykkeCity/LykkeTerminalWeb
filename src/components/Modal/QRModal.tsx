import QRCode from 'qrcode.react';
import * as React from 'react';
import ModalModel from '../../models/modalModel';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  ModalBody,
  ModalTitle,
  QRBody,
  QRButton,
  SessionQRConfirm
} from './styles';

interface QRModalProps {
  modal: ModalModel;
  qrId: string;
}

const QRModal: React.SFC<QRModalProps> = ({modal, qrId}) => {
  const handleContinue = () => {
    modal.cancelAction();
    modal.close();
  };

  return (
    <SessionQRConfirm>
      <ModalHeader onClick={handleContinue}>
        <ModalTitle>{modal.message.title}</ModalTitle>
      </ModalHeader>
      <ModalBody>{modal.message.body}</ModalBody>
      <QRBody>
        <QRCode size={128} value={qrId} />
      </QRBody>
      <QRButton onClick={handleContinue}>{modal.message.button}</QRButton>
    </SessionQRConfirm>
  );
};

export default QRModal;
