import {VBar} from '@lykkecity/react-components';
import React from 'react';
import {IconContext} from 'react-icons';
import {FiMinus, FiPlus} from 'react-icons/fi';
import {OrderBookDisplayType} from '../../models';
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
        <IconContext.Provider value={{size: '1.2rem'}}>
          <FiMinus />
        </IconContext.Provider>
      </Button>
      <div>{format(span, priceAccuracy)}</div>
      <Button onClick={onNextSpan}>
        <IconContext.Provider value={{size: '1.2rem'}}>
          <FiPlus />
        </IconContext.Provider>
      </Button>
    </StyledGrouping>
    <VBar />
    <OrderBookSwitch value={displayType} onChange={onChangeDisplayType} />
  </StyledBar>
);
