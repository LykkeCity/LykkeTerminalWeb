import React from 'react';
import {Chart} from 'react-stockcharts';

import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';

import {XAxis, YAxis} from 'react-stockcharts/lib/axes';
import {
  MouseCoordinateX,
  MouseCoordinateY
} from 'react-stockcharts/lib/coordinates';
import {MACDSeries} from 'react-stockcharts/lib/series';
import {MACDTooltip} from 'react-stockcharts/lib/tooltip';

import {colors} from '../../../styled';
import {macdStyles} from '../chartStyles';

const renderMacd = (
  xGrid,
  yGrid,
  indicatorHeight,
  ticks,
  macdCalculator,
  fullScreenMode
) => {
  return (
    <Chart
      id={'MACD'}
      height={indicatorHeight}
      yExtents={macdCalculator.accessor()}
      origin={(w, h) => [0, h - indicatorHeight]}
      padding={{top: 10, bottom: 10}}
    >
      <XAxis {...xGrid} />
      <YAxis ticks={2} {...yGrid} />

      <MouseCoordinateX
        at="bottom"
        orient="bottom"
        fill={colors.greyBorder}
        fontSize={fullScreenMode ? 14 : 12}
        displayFormat={timeFormat('%Y-%m-%d')}
      />
      <MouseCoordinateY
        at="right"
        orient="right"
        fill={colors.greyBorder}
        fontSize={fullScreenMode ? 14 : 11}
        displayFormat={format('.2f')}
      />

      <MACDSeries
        yAccessor={data => data.macd}
        {...macdStyles.macdAppearance}
      />
      <MACDTooltip
        origin={[0, 15]}
        yAccessor={data => data.macd}
        options={macdCalculator.options()}
        appearance={macdStyles.macdAppearance}
        labelFill={macdStyles.labelColor}
        fontSize={12}
      />
    </Chart>
  );
};

export default renderMacd;
