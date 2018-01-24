import {connect} from '../connect';
import ConfirmModal from './ConfirmModal';

export interface ConfirmModalProps {
  applyAction: any;
  cancelAction: any;
  closeConfirmModal: any;
  message: string;
}

const connectedConfirmModal = connect(
  ({modalStore: {applyAction, cancelAction, message, closeConfirmModal}}) => ({
    applyAction,
    cancelAction,
    closeConfirmModal,
    message
  }),
  ConfirmModal
);

export {connectedConfirmModal as ConfirmModal};
