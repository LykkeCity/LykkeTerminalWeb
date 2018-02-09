import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderChoiceButtonProps} from './index';

const StyledActionChoice = styled.div`
  min-width: 106px;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${rem(8)} ${rem(32)};

  &:first-child {
    margin-right: 5px;
  }

  &:last-child {
    margin-left: 5px;
  }

  &.active {
    border: solid 2px #0388ef;
  }

  &:hover {
    cursor: pointer;
  }
`;

const OrderChoiceButton: React.SFC<OrderChoiceButtonProps> = ({
  title,
  click,
  isActive
}) => {
  const classes = isActive ? 'active' : '';
  return (
    <StyledActionChoice onClick={click} className={classes}>
      {title}
    </StyledActionChoice>
  );
};

export default OrderChoiceButton;
