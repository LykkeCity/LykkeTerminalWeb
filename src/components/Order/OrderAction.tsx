import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderActionProps} from './index';

const StyledOrderAction = styled.div`
  display: flex;
  border: solid 1px rgba(0, 0, 0, 0.2);
  flex-direction: column;
  width: 50%;
  padding: 8px 0;

  &.ask {
    padding-right: 15px;
    align-items: flex-end;
    border-left: none;
  }

  &.bid {
    padding-left: 15px;
    align-items: flex-start;
  }

  &.active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:hover {
    cursor: pointer;
  }
`;

const StyledTitle = styled.div`
  font-size: ${rem(14)};
  color: #ccc;
  text-transform: capitalize;

  &.active {
    color: #f5f6f7;
  }
`;

const StyledPrice = styled.div`
  font-family: 'Akrobat';
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 1;
  color: #f5f6f7;
  opacity: 0.4;
  margin-top: 8px;

  &.bid.active {
    opacity: 1;
    color: #d070ff;
  }

  &.ask.active {
    opacity: 1;
    color: #fb8f01;
  }
`;

const StyledAction = styled.div`
  margin-top: 8px;
  font-size: ${rem(14)};
  color: #ccc;
  text-align: center;
  width: 40px;
  border-radius: 4px;
  text-transform: capitalize;
  border: solid 1px #ccc;
  padding: ${rem(5)};

  &.bid.active {
    background-color: #ab00ff;
    border: solid 1px #ab00ff;
    color: #f5f6f7;
  }

  &.ask.active {
    background-color: #ffae2c;
    border: solid 1px #ffae2c;
    color: #f5f6f7;
  }
`;

const OrderAction: React.SFC<OrderActionProps> = ({
  price,
  title,
  action,
  click,
  isActive
}) => {
  const classes = [title];
  if (isActive) {
    classes.push('active');
  }
  return (
    <StyledOrderAction className={classes.join(' ')} onClick={click}>
      <StyledTitle className={classes.join(' ')}>{title}</StyledTitle>
      <StyledPrice className={classes.join(' ')}>{price}</StyledPrice>
      <StyledAction className={classes.join(' ')}>{action}</StyledAction>
    </StyledOrderAction>
  );
};

export default OrderAction;
