import React from 'react';

import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';

import {Chart} from 'react-stockcharts';
import {XAxis, YAxis} from 'react-stockcharts/lib/axes';
import {
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY
} from 'react-stockcharts/lib/coordinates';
import {CandlestickSeries} from 'react-stockcharts/lib/series';

import {chartPalette, colors} from '../../../styled';

const renderCandlesChart = (
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
  const candlesAppearance = {
    candleStrokeWidth: 1,
    fill: data =>
      data.close > data.open ? chartPalette.candleUp : chartPalette.candleDown,
    opacity: 1,
    stroke: 'none',
    wickStroke: data =>
      data.close > data.open ? chartPalette.candleUp : chartPalette.candleDown,
    widthRatio: 0.8
  };

  return (
    <Chart
      id={'candles'}
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
      <XAxis showTicks={!isExternalIndicator} {...xGrid} />
      <YAxis {...yGrid} ticks={ticks} />

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

      <CandlestickSeries {...candlesAppearance} />
    </Chart>
  );
};

export default renderCandlesChart;
