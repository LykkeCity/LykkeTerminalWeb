import * as React from 'react';
import {OrderBookDisplayType} from '../../models';
import {capitalize} from '../../utils';
import {StyledSwitch, StyledSwitchItem} from './styles';

interface OrderBookSwitchProps {
  value: OrderBookDisplayType;
  onChange: (displayType: OrderBookDisplayType) => (e: any) => void;
}

const OrderBookSwitch: React.SFC<OrderBookSwitchProps> = ({
  value,
  onChange
}: any) => (
  <StyledSwitch>
    {Object.keys(OrderBookDisplayType).map(x => (
      <StyledSwitchItem
        key={x}
        active={value === x}
        onClick={onChange(x)}
        id={x}
      >
        {capitalize(OrderBookDisplayType[x])}
      </StyledSwitchItem>
    ))}
  </StyledSwitch>
);

export default OrderBookSwitch;
