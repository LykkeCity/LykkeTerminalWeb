import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderChoiceButtonProps} from './index';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50%;

  &:first-child {
    padding-right: 4px;
  }

  &:not(:first-child):last-child {
    padding-left: 4px;
  }
`;

const StyledActionChoice = styled.div`
  width: 100%;
  cursor: pointer;
  text-align: center;
  border-radius: ${rem(4)};
  padding: ${rem(7)} ${rem(12)};
  border: solid 1px rgba(140, 148, 160, 0.4);

  &.active {
    border-color: #0388ef;
    box-shadow: inset 0 0 0 1px #0388ef;
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
