import {connect} from '../connect';
import Header from './Header';

const connectedHeader = connect(
  ({authStore, settingsStore, uiStore: {readOnlyMode, theme}}) => ({
    authStore,
    readOnlyMode,
    settingsStore,
    theme
  }),
  Header
);

export {connectedHeader as Header};
