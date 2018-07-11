import {connect} from '../connect';
import BaseAssetSelection from './BaseAssetSelection';
import ConfirmationWindowSetting from './ConfirmationWindowSetting';
import SessionDurationSelection from './SessionDurationSelection';
import SettingsModal from './SettingsModal';

const connectedBaseAssetSelection = connect(
  ({referenceStore}) => ({referenceStore}),
  BaseAssetSelection
);

const connectedConfirmationWindowSetting = connect(
  ({settingsStore: {toggleConfirmations, confirmations}}) => ({
    toggleConfirmations,
    confirmations
  }),
  ConfirmationWindowSetting
);

const connectedSessionDurationSelection = connect(
  ({
    sessionStore: {
      closeSessionNotification,
      handleSetDuration,
      sessionCurrentDuration
    }
  }) => ({
    closeSessionNotification,
    handleSetDuration,
    sessionCurrentDuration
  }),
  SessionDurationSelection
);

export {connectedBaseAssetSelection as BaseAssetSelection};
export {connectedConfirmationWindowSetting as ConfirmationWindowSetting};
export {connectedSessionDurationSelection as SessionDurationSelection};
export {SettingsModal};
