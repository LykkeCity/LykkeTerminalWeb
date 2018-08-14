import {observer} from 'mobx-react';
import {connect} from '../connect';
import Chart from './Chart';

const ConnectedChart = connect(
  ({
    authStore: {isAuth},
    chartStore: {
      getDatafeed,
      loadSettings,
      saveSettings,
      subscribeToCandlesWithResolutions,
      unsubscribeFromCandle
    },
    uiStore: {selectedInstrument}
  }) => ({
    instrument: selectedInstrument,
    isAuth,
    getDatafeed,
    loadSettings,
    saveSettings,
    subscribeToCandle: subscribeToCandlesWithResolutions,
    unsubscribeFromCandle
  }),
  observer(Chart)
);

export {ConnectedChart as Chart};
