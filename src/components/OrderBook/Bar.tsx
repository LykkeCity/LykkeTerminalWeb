import React from 'react';
import {OrderBookDisplayType} from '../../models';
import {VBar} from '../Bar';
import {Icon} from '../Icon';
import OrderBookSwitch from './OrderBookSwitch';
import {StyledBar, StyledGrouping} from './styles';

export interface BarProps {
  span: number;
  onNextSpan: () => void;
  onPrevSpan: () => void;
  priceAccuracy: number;
  format: (num: number, accuracy: number) => string;
  displayType: OrderBookDisplayType;
  onChangeDisplayType: (displayType: OrderBookDisplayType) => void;
}

export default ({
  span,
  onPrevSpan,
  onNextSpan,
  priceAccuracy,
  displayType,
  onChangeDisplayType,
  format
}: BarProps) => (
  <StyledBar>
    <StyledGrouping>
      Grouping:{' '}
      <button onClick={onPrevSpan}>
        <Icon name={'minus'} />
      </button>
      <div>{format(span, priceAccuracy)}</div>
      <button onClick={onNextSpan}>
        <Icon name={'plus'} />
      </button>
    </StyledGrouping>
    <VBar />
    <OrderBookSwitch value={displayType} onChange={onChangeDisplayType} />
  </StyledBar>
);
