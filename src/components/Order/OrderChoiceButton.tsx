import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderChoiceButtonProps} from './index';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:first-child {
    padding-right: 4px;
  }

  &:not(:first-child):last-child {
    padding-left: 4px;
  }
`;

const StyledActionChoice = styled.div`
  cursor: pointer;
  text-align: center;
  padding: ${rem(7)} 0;
  color: #8c94a0;

  &.active {
    border-bottom: solid 1px #0388ef;
    color: #ffffff;
  }
`;

const OrderChoiceButton: React.SFC<OrderChoiceButtonProps> = ({
  title,
  click,
  isActive
}) => {
  const classes = isActive ? 'active' : '';
  return (
    <StyledColumn>
      <StyledActionChoice onClick={click} className={classes}>
        {title}
      </StyledActionChoice>
    </StyledColumn>
  );
};

export default OrderChoiceButton;
