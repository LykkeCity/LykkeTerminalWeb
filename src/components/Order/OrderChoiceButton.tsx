import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderChoiceButtonProps} from './index';

const StyledColumn = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-right: ${rem(22)};
  }

  margin-bottom: -1px;
`;

const StyledActionChoice = styled.div`
  cursor: pointer;
  text-align: center;
  padding: ${rem(9)} 0;
  color: #8c94a0;
  font-size: ${rem(18)};
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: rgb(3, 136, 239);
    color: rgb(255, 255, 255);
    font-weight: 600;
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
