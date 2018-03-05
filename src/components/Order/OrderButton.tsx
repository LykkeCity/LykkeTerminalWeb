import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderButtonProps} from './index';

const StyledButton = styled.button`
  width: 100%;
  min-height: ${rem(50)};
  border-radius: 4px;
  font-size: ${rem(16)};
  padding: ${rem(12)} ${rem(20)};
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  color: #ffffff;
  outline: none;
  border: none;
  font-family: 'Proxima Nova', sans-serif;

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
    opacity: 0.5;
  }
`;

const OrderButton: React.SFC<OrderButtonProps> = ({
  action,
  isDisable,
  type,
  message
}) => {
  const btnClass = isDisable ? `disable ${action}` : action;

  return (
    <StyledButton type={type} className={btnClass} disabled={isDisable}>
      {message}
    </StyledButton>
  );
};

export default OrderButton;
export {StyledButton};
