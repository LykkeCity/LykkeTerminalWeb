import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderChoiceButtonProps} from './index';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:first-child {
    padding-right: ${rem(4)};
  }

  &:not(:first-child):last-child {
    padding-left: ${rem(4)};
  }

  margin-bottom: -1px;
`;

const StyledActionChoice = styled.div`
  cursor: pointer;
  text-align: center;
  padding: ${rem(16)} 0;
  color: #8c94a0;
  font-size: ${rem(18)};
  border-bottom: 1px solid transparent;

  &.active {
    border-bottom: 1px solid #0388ef;
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
