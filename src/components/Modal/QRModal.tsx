import QRCode from 'qrcode.react';
import * as React from 'react';
import {TFA_ROUTE} from '../../constants/lykkeRoutes';
import ModalModel from '../../models/modalModel';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  ModalBody,
  ModalTitle,
  QRBody,
  QRButton,
  QRCodeWrapper,
  SessionQRConfirm,
  TfaSetupButton,
  TfaSetupLink
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
      <ModalBody>
        <div style={{width: '300px'}}>{message.body}</div>
      </ModalBody>
      <QRBody>
        <QRCodeWrapper>
          <QRCode size={160} value={qrId} />
        </QRCodeWrapper>
      </QRBody>
      <TfaSetupButton>
        <TfaSetupLink href={TFA_ROUTE}>
          Use Google Authenticator instead
        </TfaSetupLink>
      </TfaSetupButton>
      <QRButton onClick={handleContinue}>{message.button}</QRButton>
    </SessionQRConfirm>
  );
};

export default QRModal;
