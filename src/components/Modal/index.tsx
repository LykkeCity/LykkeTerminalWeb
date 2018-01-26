import ModalModel from '../../models/modalModel';
import ConfirmModal from './ConfirmModal';
import SettingsModal from './SettingsModal';

export interface ConfirmModalProps {
  modal: ModalModel;
}

export interface SettingsModalProps {
  modal: ModalModel;
}

export interface ModalProps {
  modals: ModalModel[];
}

const Modals = {
  Confirm: ConfirmModal,
  Settings: SettingsModal
};

export {Modals};
