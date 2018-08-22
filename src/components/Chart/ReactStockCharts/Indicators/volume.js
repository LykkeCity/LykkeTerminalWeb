import React from 'react';
import {Chart} from 'react-stockcharts';
import {AreaSeries, BarSeries} from 'react-stockcharts/lib/series';
import {CurrentCoordinate} from 'react-stockcharts/lib/coordinates';

import {chartPalette, colors} from '../../../styled';

const renderVolume = (
  height,
  width,
  indicatorHeight,
  smaVolume,
  isMa,
  isExternalIndicator
) => {
  return (
    <Chart
      id={'volume'}
      yExtents={[data => data.volume]}
      height={indicatorHeight}
      origin={(w, h) => [
        0,
        h - indicatorHeight * (isExternalIndicator ? 2 : 1)
      ]}
    >
      <BarSeries
        yAccessor={data => data.volume}
        opacity={0.5}
        fill={data =>
          data.close > data.open
            ? chartPalette.volumeUp
            : chartPalette.volumeDown
        }
      />
      {isMa ? (
        <AreaSeries
          yAccessor={smaVolume.accessor()}
          stroke={smaVolume.stroke()}
          fill={smaVolume.fill()}
          opacity={0.25}
        />
      ) : null}
      <CurrentCoordinate yAccessor={data => data.volume} fill={colors.blue} />
    </Chart>
  );
};

export default renderVolume;
