import QRCode from 'qrcode.react';
import * as React from 'react';
import ModalModel from '../../models/modalModel';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  ModalBody,
  ModalTitle,
  QRBody,
  QRButton,
  QRCodeWrapper,
  SessionQRConfirm
} from './styles';

interface QRModalProps {
  modal: ModalModel;
  qrId: string;
}

const QRModal: React.SFC<QRModalProps> = ({
  modal: {cancelAction, close, message},
  qrId
}) => {
  const handleContinue = () => {
    cancelAction();
    close();
  };

  return (
    <SessionQRConfirm>
      <ModalHeader onClick={handleContinue}>
        <ModalTitle>{message.title}</ModalTitle>
      </ModalHeader>
      <ModalBody>{message.body}</ModalBody>
      <QRBody>
        <QRCodeWrapper>
          <QRCode size={160} value={qrId} />
        </QRCodeWrapper>
      </QRBody>
      <QRButton onClick={handleContinue}>{message.button}</QRButton>
    </SessionQRConfirm>
  );
};

export default QRModal;
