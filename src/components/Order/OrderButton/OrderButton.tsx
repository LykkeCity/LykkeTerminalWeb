import * as React from 'react';
import styled from 'styled-components';
import {OrderButtonProps} from '../index';

const StyledButton = styled.div`
  width: 100%;
  height: 49px;
  border-radius: 4px;
  text-transform: capitalize;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #ffffff;

  &.sell {
    background-color: #ab00ff;
    border: solid 1px #ab00ff;
  }

  &.buy {
    background-color: #ffae2c;
    border: solid 1px #ffae2c;
  }

  &:hover {
    cursor: pointer;
  }
`;

const OrderButton: React.SFC<OrderButtonProps> = ({action, price, click}) => {
  return (
    <StyledButton className={action} onClick={click}>
      {action} at {price}
    </StyledButton>
  );
};

export default OrderButton;
