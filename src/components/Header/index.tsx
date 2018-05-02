import {connect} from '../connect';
import Header from './Header';

const connectedHeader = connect(
  ({authStore, settingsStore, uiStore: {readOnlyMode}}) => ({
    authStore,
    readOnlyMode,
    settingsStore
  }),
  Header
);

export {connectedHeader as Header};
