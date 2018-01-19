import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {capitalize} from '../../utils';
import {OrderButtonProps} from './index';

const StyledButton = styled.div`
  width: 100%;
  min-height: 49px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${rem(16)};
  cursor: pointer;

  &.sell {
    background-color: #ab00ff;
    border: solid 1px #ab00ff;
  }

  &.buy {
    background-color: #ffae2c;
    border: solid 1px #ffae2c;
  }
`;

const OrderButton: React.SFC<OrderButtonProps> = ({
  action,
  price,
  click,
  quoteName,
  baseName,
  quantity
}) => {
  return (
    <StyledButton className={action} onClick={click}>
      {capitalize(action)} {quantity} {baseName} at {price}
    </StyledButton>
  );
};

export default OrderButton;
