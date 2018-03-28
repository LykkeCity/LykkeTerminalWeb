import * as React from 'react';
import ModalModel from '../../models/modalModel';
import ConfirmModal from './ConfirmModal';
import ExpiredModal from './ExpiredModal';
import {EditOrder, KycModal, QRModal} from './index';

const Modals = {
  Confirm: ConfirmModal,
  EditOrder,
  Expired: ExpiredModal,
  QR: QRModal,
  MissedKyc: KycModal
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
