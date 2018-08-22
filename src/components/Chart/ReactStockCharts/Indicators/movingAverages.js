import React from 'react';

import {LineSeries} from 'react-stockcharts/lib/series';
import {CurrentCoordinate} from 'react-stockcharts/lib/coordinates';
import {MovingAverageTooltip} from 'react-stockcharts/lib/tooltip';

import {movingAveragesStyles} from '../chartStyles';

const renderMovingAverages = (height, padding, lines) => {
  return (
    <React.Fragment>
      <LineSeries
        yAccessor={lines.sma.accessor()}
        stroke={lines.sma.stroke()}
      />
      <LineSeries
        yAccessor={lines.wma.accessor()}
        stroke={lines.wma.stroke()}
      />
      <LineSeries
        yAccessor={lines.tma.accessor()}
        stroke={lines.tma.stroke()}
      />
      <LineSeries
        yAccessor={lines.ema.accessor()}
        stroke={lines.ema.stroke()}
      />
      <CurrentCoordinate
        yAccessor={lines.sma.accessor()}
        fill={lines.sma.stroke()}
      />
      <CurrentCoordinate
        yAccessor={lines.wma.accessor()}
        fill={lines.wma.stroke()}
      />
      <CurrentCoordinate
        yAccessor={lines.tma.accessor()}
        fill={lines.tma.stroke()}
      />
      <CurrentCoordinate
        yAccessor={lines.ema.accessor()}
        fill={lines.ema.stroke()}
      />

      <MovingAverageTooltip
        onClick={e => e}
        origin={[0, 20]}
        fontSize={12}
        labelFill={movingAveragesStyles.labelColor}
        textFill={movingAveragesStyles.textColor}
        options={[
          {
            stroke: lines.sma.stroke(),
            type: 'SMA',
            windowSize: lines.sma.options().windowSize,
            yAccessor: lines.sma.accessor()
          },
          {
            stroke: lines.wma.stroke(),
            type: 'WMA',
            windowSize: lines.wma.options().windowSize,
            yAccessor: lines.wma.accessor()
          },
          {
            stroke: lines.tma.stroke(),
            type: 'TMA',
            windowSize: lines.tma.options().windowSize,
            yAccessor: lines.tma.accessor()
          },
          {
            stroke: lines.ema.stroke(),
            type: 'EMA',
            windowSize: lines.ema.options().windowSize,
            yAccessor: lines.ema.accessor()
          }
        ]}
      />
    </React.Fragment>
  );
};

export default renderMovingAverages;
