import ModalModel from '../../models/modalModel';
import ConfirmModal from './ConfirmModal';

export interface ConfirmModalProps {
  modal: ModalModel;
}

export interface ModalProps {
  modals: ModalModel[];
}

const Modals = {
  Confirm: ConfirmModal
};

export {Modals};
