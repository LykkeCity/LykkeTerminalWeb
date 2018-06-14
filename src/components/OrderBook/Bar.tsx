import React from 'react';
import {OrderBookDisplayType} from '../../models';
import {VBar} from '../Bar';
import {Icon} from '../Icon';
import OrderBookSwitch from './OrderBookSwitch';
import {Button, StyledBar, StyledGrouping} from './styles';

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
      <Button onClick={onPrevSpan}>
        <Icon name={'minus'} />
      </Button>
      <div>{format(span, priceAccuracy)}</div>
      <Button onClick={onNextSpan}>
        <Icon name={'plus'} />
      </Button>
    </StyledGrouping>
    <VBar />
    <OrderBookSwitch value={displayType} onChange={onChangeDisplayType} />
  </StyledBar>
);
