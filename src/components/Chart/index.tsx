import {observer} from 'mobx-react';
import {compose} from 'rambda';
import {connect} from '../connect';
import withLoader, {LoaderProps} from '../Loader/withLoader';
import Chart from './Chart';

const ConnectedChart = connect(
  ({
    authStore: {isAuth},
    chartStore: {
      isChartLoaded,
      getDatafeed,
      loadSettings,
      saveSettings,
      toggleChartLoaded,
      subscribeToCandlesWithResolutions,
      unsubscribeFromCandle
    },
    uiStore: {selectedInstrument, selectedPriceType, selectPriceType}
  }) => ({
    loading: !isChartLoaded,
    instrument: selectedInstrument,
    isAuth,
    selectedPriceType,
    selectPriceType,
    toggleChartLoaded,
    getDatafeed,
    loadSettings,
    saveSettings,
    subscribeToCandle: subscribeToCandlesWithResolutions,
    unsubscribeFromCandle
  }),
  compose(
    withLoader<LoaderProps>(p => p.loading!),
    observer
  )(Chart)
);

export {ConnectedChart as Chart};
