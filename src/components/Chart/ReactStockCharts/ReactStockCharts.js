import {closestIndexTo, isEqual} from 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';

import {ChartCanvas} from 'react-stockcharts';
import {discontinuousTimeScaleProvider} from 'react-stockcharts/lib/scale';
import {macd, ema, wma, sma, tma} from 'react-stockcharts/lib/indicator';
import {fitDimensions} from 'react-stockcharts/lib/helper';
import {last} from 'react-stockcharts/lib/utils';

import {
  chartIndicators,
  DEFAULT_SCALE
} from '../../../constants/priceChartConstants';
import {StockChartType} from '../../../models';
import {renderMacd, renderVolume} from './Indicators/';
import {
  renderAreaChart,
  renderAuxiliaryTools,
  renderCandlesChart
} from './Components/';
import {
  getChartSettings,
  getExternalIndicatorSettings,
  movingAveragesStyles,
  xGridCalc,
  yGridCalc
} from './chartStyles';

class StockChart extends React.Component {
  constructor(props) {
    super(props);

    this.ema = ema()
      .options({windowSize: 9, sourcePath: 'close'})
      .skipUndefined(true)
      .merge((data, close) => {
        data.ema = close;
      })
      .accessor(data => data.ema)
      .stroke(movingAveragesStyles.ema.stroke);

    this.sma = sma()
      .options({windowSize: 9})
      .merge((data, close) => {
        data.sma = close;
      })
      .accessor(data => data.sma)
      .stroke(movingAveragesStyles.sma.stroke);

    this.wma = wma()
      .options({windowSize: 9})
      .merge((data, close) => {
        data.wma = close;
      })
      .accessor(data => data.wma)
      .stroke(movingAveragesStyles.wma.stroke);

    this.tma = tma()
      .options({windowSize: 9})
      .merge((data, close) => {
        data.tma = close;
      })
      .accessor(data => data.tma)
      .stroke(movingAveragesStyles.tma.stroke);

    this.smaVolume = sma()
      .options({windowSize: 9, sourcePath: 'volume'})
      .merge((data, close) => {
        data.smaVolume = close;
      })
      .accessor(data => data.smaVolume)
      .stroke(movingAveragesStyles.smaVolume.stroke)
      .fill(movingAveragesStyles.smaVolume.fill);

    this.macdCalculator = macd()
      .options({fast: 12, slow: 26, signal: 9})
      .merge((data, close) => {
        data.macd = close;
      })
      .accessor(data => data.macd);

    this.allDataReceived = false;
    this.chartChangeTimeout = null;
    this.chartRef = React.createRef();
    this.scale = DEFAULT_SCALE;
    this.scrolled = 0;
    this.startDate = null;

    this.handleDataUpdate = this.handleDataUpdate.bind(this);
  }

  async handleDataUpdate(start, end) {
    start = Math.ceil(start);
    if (this.allDataReceived || this.props.loading || start === end) return;
    if (this.chartChangeTimeout) {
      clearTimeout(this.chartChangeTimeout);
      this.chartChangeTimeout = null;
    }

    const rowsToDownload = end - start;
    const data = this.chartRef.current.getDataInfo().plotData;

    this.setChartScale(rowsToDownload + data.length);
    this.setChartScrolled();
    this.setChartStart();

    const newData = await this.props.dataUpdate(rowsToDownload);

    if (!newData.length) {
      return (this.allDataReceived = true);
    }
  }

  checkIndicatorStatus = indicatorName =>
    this.props.indicators.find(indicator => indicator.value === indicatorName)
      .isActive;

  getChartStart = data => {
    if (this.startDate) {
      const dates = data.map(dataRow => new Date(dataRow.date));
      return data[closestIndexTo(this.startDate, dates)];
    }
  };

  setChartScale = newScale => {
    const data = this.chartRef.current.getDataInfo().plotData;
    this.scale = newScale ? newScale : data.length;
  };

  setChartScrolled = () => {
    const fullData = this.chartRef.current.getDataInfo().fullData;
    const plotData = this.chartRef.current.getDataInfo().plotData;
    this.scrolled =
      fullData[fullData.length - 1].idx.index -
      plotData[plotData.length - 1].idx.index;
  };

  setChartStart = () => {
    const fullData = this.chartRef.current.getDataInfo().fullData;
    const plotData = this.chartRef.current.getDataInfo().plotData;
    const newStartDate = new Date(plotData[plotData.length - 1].date);
    const lastDate = new Date(fullData[fullData.length - 1].date);
    this.startDate = isEqual(newStartDate, lastDate) ? null : newStartDate;
  };

  render() {
    const {ema, sma, wma, tma, smaVolume, macdCalculator} = this;
    const {
      data,
      chartType,
      type,
      width,
      height,
      ratio,
      fullScreenMode
    } = this.props;

    const lines = {sma, wma, tma, ema};
    const calculatedData = ema(sma(wma(tma(smaVolume(macdCalculator(data))))));
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      data => data.date
    );
    const {data: xData, xScale, xAccessor, displayXAccessor} = xScaleProvider(
      calculatedData
    );

    const start = xAccessor(this.getChartStart(xData) || last(xData));
    const end = xAccessor(
      xData[Math.max(0, xData.length - this.scrolled - this.scale)]
    );
    const xExtents = [start, end];

    const chart = getChartSettings(fullScreenMode);
    const subIndicator = getExternalIndicatorSettings(fullScreenMode);

    const gridHeight = height - chart.margin.top - chart.margin.bottom;
    const gridWidth = width - chart.margin.left - chart.margin.right;
    const xGrid = chart.showGrid ? xGridCalc(gridHeight, fullScreenMode) : {};
    const yGrid = chart.showGrid ? yGridCalc(gridWidth, fullScreenMode) : {};

    const activeIndicators = {
      volume: this.checkIndicatorStatus(chartIndicators.volume.value),
      macd: this.checkIndicatorStatus(chartIndicators.macd.value),
      ma: this.checkIndicatorStatus(chartIndicators.ma.value)
    };
    const isExternalIndicator = activeIndicators.macd;
    const chartHeight = isExternalIndicator
      ? height - (subIndicator.height + chart.margin.top + chart.margin.bottom)
      : height - (chart.margin.top + chart.margin.bottom);

    const onChartChange = () => {
      this.chartChangeTimeout = setTimeout(() => {
        this.setChartScrolled();
        this.setChartScale();
        this.setChartStart();

        this.chartChangeTimeout = null;
      }, 100);
    };

    return (
      <div onWheel={onChartChange} onClick={onChartChange}>
        <ChartCanvas
          height={height}
          width={width}
          ratio={ratio}
          margin={chart.margin}
          type={type}
          seriesName="MSFT"
          data={xData}
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={xExtents}
          displayXAccessor={displayXAccessor}
          onLoadMore={this.handleDataUpdate}
          ref={this.chartRef}
        >
          {renderAuxiliaryTools(chartHeight, chart.padding, fullScreenMode)}

          {chartType === StockChartType.Candles
            ? renderCandlesChart(
                chartHeight,
                chart.padding,
                xGrid,
                yGrid,
                isExternalIndicator,
                chart.ticks,
                activeIndicators.ma,
                lines,
                fullScreenMode
              )
            : null}

          {chartType === StockChartType.Line ||
          chartType === StockChartType.Area
            ? renderAreaChart(
                chartType,
                chartHeight,
                chart.padding,
                xGrid,
                yGrid,
                isExternalIndicator,
                chart.ticks,
                activeIndicators.ma,
                lines,
                fullScreenMode
              )
            : null}

          {activeIndicators.volume
            ? renderVolume(
                chartHeight,
                width,
                subIndicator.height,
                smaVolume,
                activeIndicators.ma,
                isExternalIndicator,
                fullScreenMode
              )
            : null}

          {activeIndicators.macd
            ? renderMacd(
                xGrid,
                yGrid,
                subIndicator.height,
                subIndicator.ticks,
                macdCalculator,
                fullScreenMode
              )
            : null}
        </ChartCanvas>
      </div>
    );
  }
}

StockChart.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
  chartType: PropTypes.string.isRequired
};

StockChart.defaultProps = {type: 'hybrid'};
StockChart = fitDimensions(StockChart);

export default StockChart;
