import * as React from 'react';
import ModalModel from '../../models/modalModel';
import ConfirmModal from './ConfirmModal';
import ExpiredModal from './ExpiredModal';
import {ModalProps} from './index';

const Modals = {
  Confirm: ConfirmModal,
  Expired: ExpiredModal
};

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
