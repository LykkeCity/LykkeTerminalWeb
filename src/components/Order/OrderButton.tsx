import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderButtonProps} from './index';

const StyledButton = styled.button.attrs({
  style: (props: any) => ({
    cursor: `${props.disabled ? 'not-allowed' : 'pointer'}`,
    opacity: `${props.disabled ? '0.5' : '1'}`
  })
})`
  width: 100%;
  min-height: ${rem(50)};
  border-radius: 4px;
  font-size: ${rem(16)};
  padding: ${rem(12)} ${rem(20)};
  font-weight: bold;
  line-height: 1;
  color: #ffffff;
  outline: none;
  border: none;
  font-family: 'Proxima Nova', sans-serif;
  background-color: #0388ef;
  border: solid 1px #0388ef;

  &.disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const OrderButton: React.SFC<OrderButtonProps> = ({
  isDisable,
  type,
  message
}) => {
  return (
    <StyledButton type={type} disabled={isDisable}>
      {message}
    </StyledButton>
  );
};

export default OrderButton;
export {StyledButton};
