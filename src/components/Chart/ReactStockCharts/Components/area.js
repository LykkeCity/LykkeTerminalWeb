import React from 'react';

import {format} from 'd3-format';
import {curveMonotoneX} from 'd3-shape';
import {timeFormat} from 'd3-time-format';

import {Chart} from 'react-stockcharts';
import {XAxis, YAxis} from 'react-stockcharts/lib/axes';
import {
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY
} from 'react-stockcharts/lib/coordinates';
import {AreaSeries} from 'react-stockcharts/lib/series';
import {
  createVerticalLinearGradient,
  hexToRGBA
} from 'react-stockcharts/lib/utils';

import {StockChartType} from '../../../../models';
import {chartPalette, colors} from '../../../styled';
import {renderMovingAverages} from '../Indicators/';

const renderAreaChart = (
  chartType,
  height,
  padding,
  xGrid,
  yGrid,
  isExternalIndicator,
  ticks,
  isMa,
  lines,
  fullScreenMode
) => {
  const areaFill =
    chartType === StockChartType.Area ? 'url(#AreaGradient)' : 'transparent';
  const gradient =
    chartType === StockChartType.Area
      ? chartPalette.area.map(level => ({
          color: hexToRGBA(level.color, level.opacity),
          stop: level.stop
        }))
      : [];
  const canvasGradient = createVerticalLinearGradient(gradient);

  return (
    <Chart
      id={'line-area'}
      height={height}
      padding={padding}
      yExtents={[
        data => data.close,
        lines.sma.accessor(),
        lines.wma.accessor(),
        lines.tma.accessor(),
        lines.ema.accessor()
      ]}
    >
      <defs>
        <linearGradient id="AreaGradient" x1="0" y1="100%" x2="0" y2="0%">
          {chartPalette.area.map((level, index) => (
            <stop
              offset={`${level.stop * 100}%`}
              stopColor={level.color}
              stopOpacity={level.opacity}
              key={index}
            />
          ))}
        </linearGradient>
      </defs>

      <XAxis showTicks={!isExternalIndicator} {...xGrid} />
      <YAxis ticks={ticks} {...yGrid} />

      {!isExternalIndicator ? (
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          fill={colors.greyBorder}
          fontSize={fullScreenMode ? 14 : 12}
          displayFormat={timeFormat('%Y-%m-%d')}
        />
      ) : null}
      <MouseCoordinateY
        at="right"
        orient="right"
        fill={colors.greyBorder}
        fontSize={fullScreenMode ? 14 : 11}
        displayFormat={format('.2f')}
        arrowWidth={0}
      />
      <EdgeIndicator
        itemType="last"
        orient="right"
        edgeAt="right"
        yAccessor={data => data.close}
        fill={data =>
          data.close > data.open
            ? chartPalette.candleUp
            : chartPalette.candleDown
        }
        lineStroke={data =>
          data.close > data.open
            ? chartPalette.candleUp
            : chartPalette.candleDown
        }
        textFill={colors.greyBorder}
        fontSize={fullScreenMode ? 14 : 11}
        rectHeight={fullScreenMode ? 20 : 15}
        arrowWidth={0}
      />

      {isMa ? renderMovingAverages(height, padding, lines) : null}

      <AreaSeries
        yAccessor={data => data.close}
        interpolation={curveMonotoneX}
        canvasGradient={canvasGradient}
        fill={areaFill}
        stroke={chartPalette.line.color}
        strokeWidth={chartPalette.line.width}
      />
    </Chart>
  );
};

export default renderAreaChart;
