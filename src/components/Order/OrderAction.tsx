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
    padding-right: 24px;
    align-items: flex-end;
  }

  &.bid {
    padding-left: 24px;
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
  font-size: 14px;
  line-height: 1.14;
  color: #ccc;
  text-transform: capitalize;

  &.active {
    color: #f5f6f7;
  }
`;

const StyledPrice = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #ccc;
  margin-top: 8px;

  &.bid.active {
    color: #d070ff;
  }

  &.ask.active {
    color: #fb8f01;
  }
`;

const StyledAction = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.71;
  color: #ccc;
  text-align: center;
  width: 40px;
  height: 24px;
  border-radius: 4px;
  text-transform: capitalize;
  border: solid 1px #ccc;

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
