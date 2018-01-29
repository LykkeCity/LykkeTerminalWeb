import AuthStore from '../../stores/authStore';
import SettingsStore from '../../stores/settingsStore';
import {connect} from '../connect';
import Header from './Header';

export interface HeaderProps {
  authStore: AuthStore;
  history: any;
  settingsStore: SettingsStore;
}

const connectedHeader = connect(
  ({authStore, settingsStore}) => ({
    authStore,
    settingsStore
  }),
  Header
);

export {connectedHeader as Header};
