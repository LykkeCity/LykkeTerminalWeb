import React from 'react';

import {Chart} from 'react-stockcharts';
import {CrossHairCursor} from 'react-stockcharts/lib/coordinates';
import {GroupTooltip} from 'react-stockcharts/lib/tooltip';

import {colors} from '../../../styled';

const renderAuxiliaryTools = (height, padding, fullScreenMode) => (
  <Chart
    id={'axis'}
    yExtents={data => data.close}
    height={height}
    padding={padding}
  >
    <CrossHairCursor stroke={colors.lightGrey} />

    <GroupTooltip
      layout={'horizontalInline'}
      fontSize={fullScreenMode ? 16 : 13}
      origin={[0, 0]}
      options={[
        {
          labelFill: colors.coolGrey,
          valueFill: colors.whiteText,
          yAccessor: data => data.open,
          yLabel: 'O'
        },
        {
          labelFill: colors.coolGrey,
          valueFill: colors.whiteText,
          yAccessor: data => data.high,
          yLabel: 'H'
        },
        {
          labelFill: colors.coolGrey,
          valueFill: colors.whiteText,
          yAccessor: data => data.low,
          yLabel: 'L'
        },
        {
          labelFill: colors.coolGrey,
          valueFill: colors.whiteText,
          yAccessor: data => data.close,
          yLabel: 'C'
        }
      ]}
    />
  </Chart>
);

export default renderAuxiliaryTools;
