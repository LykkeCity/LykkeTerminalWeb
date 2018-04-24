import {connect} from '../connect';
import Header from './Header';

const connectedHeader = connect(
  ({authStore, settingsStore, uiStore: {viewMode}}) => ({
    authStore,
    viewMode,
    settingsStore
  }),
  Header
);

export {connectedHeader as Header};
