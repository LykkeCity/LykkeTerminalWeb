import * as React from 'react';
import ModalModel from '../../models/modalModel';
import AssetDisclaimer from './AssetDisclaimer';
import ConfirmModal from './ConfirmModal';
import ExpiredModal from './ExpiredModal';
import {EditOrder, QRModal} from './index';
import KycModal from './KycModal';
import ManageFundsModal from './ManageFundsModal';
import TfaModal from './TfaModal';

const Modals = {
  AssetDisclaimer,
  Confirm: ConfirmModal,
  EditOrder,
  Expired: ExpiredModal,
  QR: QRModal,
  TFA: TfaModal,
  MissedKyc: KycModal,
  ManageFunds: ManageFundsModal
};

interface ModalProps {
  modals: ModalModel[];
}

class Modal extends React.Component<ModalProps> {
  constructor(props: ModalProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.modals.map((modal: ModalModel, index: number) => {
          const CurrentModal = Modals[modal.type];
          return <CurrentModal key={index} modal={modal} />;
        })}
      </div>
    );
  }
}

export default Modal;
