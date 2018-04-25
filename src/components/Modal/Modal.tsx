import * as React from 'react';
import ModalModel from '../../models/modalModel';
import AttentionModal from './AttentionModal';
import ConfirmModal from './ConfirmModal';
import ExpiredModal from './ExpiredModal';
import {EditOrder, QRModal} from './index';

const Modals = {
  Confirm: ConfirmModal,
  EditOrder,
  Expired: ExpiredModal,
  Attention: AttentionModal,
  QR: QRModal
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
