import QRCode from 'qrcode.react';
import * as React from 'react';
import ModalModel from '../../models/modalModel';
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
      <ModalTitle>{modal.message.title}</ModalTitle>
      <ModalBody>{modal.message.body}</ModalBody>
      <QRBody>
        <QRCode size={128} value={qrId} />
      </QRBody>
      <QRButton onClick={handleContinue}>{modal.message.button}</QRButton>
    </SessionQRConfirm>
  );
};

export default QRModal;
