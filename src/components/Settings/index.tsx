import SettingsStore from '../../stores/settingsStore';
import {connect} from '../connect';
import SettingsModal from './SettingsModal';

export interface SettingsModalProps {
  settingsStore: SettingsStore;
}

const connectedSettingsModal = connect(
  ({settingsStore}) => ({
    settingsStore
  }),
  SettingsModal
);

export {connectedSettingsModal as SettingsModal};
