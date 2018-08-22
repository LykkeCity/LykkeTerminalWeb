import {observer} from 'mobx-react';
import {compose} from 'rambda';
import {connect} from '../connect';
import withLoader from '../Loader/withLoader';
import Chart, {ChartProps} from './Chart';

const ConnectedChart = connect<ChartProps>(
  ({
    chartStore: {
      hasPendingCandles,
      initialData,
      isIndicatorsPopupShown,
      indicators,
      fetchCandles,
      fullScreenMode,
      selectedChartType,
      selectedChartInterval,
      toggleChartType,
      toggleChartInterval,
      toggleIndicatorsPopup,
      toggleIndicator,
      toggleFullScreenMode
    }
  }) => ({
    loading: hasPendingCandles,
    initialData,
    isIndicatorsPopupShown,
    indicators,
    fetchCandles,
    fullScreenMode,
    selectedChartType,
    selectedChartInterval,
    toggleChartType,
    toggleChartInterval,
    toggleIndicatorsPopup,
    toggleIndicator,
    toggleFullScreenMode
  }),
  compose(withLoader<ChartProps>(p => p.loading!))(observer(Chart))
);

export {ConnectedChart as PriceChart};
