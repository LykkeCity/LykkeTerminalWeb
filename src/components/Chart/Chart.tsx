import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {
  CHART_ID,
  IchartIndicator,
  IchartInterval
} from '../../constants/priceChartConstants';
import {
  ChartCandleModel,
  ChartControlButtonType,
  StockChartType
} from '../../models';
import {ChartStore} from '../../stores/index';
import {Icon} from '../Icon';
import {LoaderProps} from '../Loader/withLoader';
import {colors} from '../styled';
import {ChartDropdown, IndicatorsPopup} from './Controls';
import ReactChart from './ReactStockCharts/ReactStockCharts.js';
import {ChartContainer, ChartControls, ChartControlsItem} from './styles';

export interface ChartProps extends LoaderProps {
  initialData?: ChartCandleModel[];
  indicators: IchartIndicator[];
  fetchCandles: (scale: number) => Promise<any>;
  fullScreenMode: boolean;
  isIndicatorsPopupShown: boolean;
  selectedChartType: StockChartType;
  selectedChartInterval: IchartInterval;
  setChartInterval: (interval: string) => void;
  toggleChartType: (type: string) => void;
  toggleIndicator: (indicatorName: string) => void;
  toggleIndicatorsPopup: () => void;
  toggleFullScreenMode: () => void;
}

const Chart: React.SFC<ChartProps> = ({
  initialData,
  indicators,
  isIndicatorsPopupShown,
  fetchCandles,
  fullScreenMode,
  selectedChartType,
  selectedChartInterval,
  setChartInterval,
  toggleChartType,
  toggleIndicatorsPopup,
  toggleIndicator,
  toggleFullScreenMode,
  loading
}) => {
  const chartTypes = ChartStore.chartTypes.map((type: StockChartType) => ({
    label: type,
    description: type,
    value: type
  }));
  const intervals = ChartStore.intervals.map((interval: IchartInterval) => ({
    label: interval.label,
    description: interval.description,
    value: interval.value
  }));

  if (!initialData || !initialData.length) {
    return null;
  }

  return (
    <ReactResizeDetector
      handleWidth={true}
      handleHeight={true}
      resizableElementId={CHART_ID}
    >
      {(width: number, height: number) => {
        const size =
          width && height
            ? {width: Math.floor(width), height: Math.floor(height)}
            : {};

        return (
          <ChartContainer fullScreenMode={fullScreenMode} id={CHART_ID}>
            <ChartControls>
              <ChartControlsItem>
                <ChartDropdown
                  controlButtonName={selectedChartInterval.label}
                  controlButtonType={ChartControlButtonType.Text}
                  items={intervals}
                  onClick={setChartInterval}
                  selectedValue={selectedChartInterval.value}
                />
              </ChartControlsItem>
              <ChartControlsItem>
                <ChartDropdown
                  controlButtonName={'candles'}
                  controlButtonType={ChartControlButtonType.Image}
                  items={chartTypes}
                  onClick={toggleChartType}
                  selectedValue={selectedChartType}
                />
              </ChartControlsItem>
              <ChartControlsItem onClick={toggleIndicatorsPopup}>
                <Icon name={'rates'} color={colors.whiteText} />
              </ChartControlsItem>
              {fullScreenMode ? (
                <ChartControlsItem
                  onClick={toggleFullScreenMode}
                  className={'full-screen'}
                >
                  Exit full screen{' '}
                  <Icon name={'close-small'} color={colors.coolGrey} />
                </ChartControlsItem>
              ) : (
                <ChartControlsItem onClick={toggleFullScreenMode}>
                  <Icon name={'expand'} color={colors.whiteText} />
                </ChartControlsItem>
              )}
            </ChartControls>

            <ReactChart
              chartType={selectedChartType}
              data={initialData}
              dataUpdate={fetchCandles}
              indicators={indicators}
              fullScreenMode={fullScreenMode}
              loading={loading}
              {...size}
            />

            <IndicatorsPopup
              isIndicatorsPopupShown={isIndicatorsPopupShown}
              indicators={indicators}
              toggleIndicatorsPopup={toggleIndicatorsPopup}
              toggleIndicator={toggleIndicator}
            />
          </ChartContainer>
        );
      }}
    </ReactResizeDetector>
  );
};

export default Chart;
