import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {capitalize} from '../../utils';
import {OrderButtonProps} from './index';

const StyledButton = styled.button`
  width: 100%;
  min-height: 49px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${rem(16)};
  cursor: pointer;
  color: #f5f6f7;
  outline: none;
  border: none;

  &.sell {
    background-color: #ab00ff;
    border: solid 1px #ab00ff;
  }

  &.buy {
    background-color: #ffae2c;
    border: solid 1px #ffae2c;
  }

  &.disable {
    cursor: not-allowed;
    opacity: 0.72;
  }
`;

const OrderButton: React.SFC<OrderButtonProps> = ({
  action,
  price,
  baseName,
  quantity,
  isDisable,
  type
}) => {
  const btnClass = isDisable ? `disable ${action}` : action;

  return (
    <StyledButton type={type} className={btnClass} disabled={isDisable}>
      {capitalize(action)} {quantity} {baseName} at {price}
    </StyledButton>
  );
};

export default OrderButton;
