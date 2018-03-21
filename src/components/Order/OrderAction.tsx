import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {OrderActionProps} from './index';

const StyledOrderAction = styled.div`
  display: flex;
  border-bottom: solid 1px #292929;
  flex-direction: column;
  width: 50%;
  padding: ${rem(8)} 0;
  height: ${rem(100)};

  &.ask {
    padding-right: ${rem(15)};
    align-items: flex-end;
    border-left: none;
  }

  &.bid {
    padding-left: ${rem(15)};
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
  color: rgba(245, 246, 247, 0.4);
  text-transform: capitalize;
`;

const StyledPrice = styled.div`
  font-family: 'Akrobat';
  font-size: ${rem(28)};
  font-weight: bold;
  line-height: 1;
  margin-top: ${rem(4)};
  color: rgba(245, 246, 247, 0.4);

  &.bid.active {
    color: #d070ff;
  }

  &.ask.active {
    color: #fb8f01;
  }
`;

const StyledAction = styled.div`
  margin-top: ${rem(8)};
  font-size: ${rem(14)};
  color: rgba(245, 246, 247, 0.6);
  text-align: center;
  width: 40px;
  border-radius: 4px;
  text-transform: capitalize;
  border: solid 1px rgba(245, 246, 247, 0.4);
  padding: ${rem(3)} ${rem(5)};

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
  const priceWithLocale = formattedNumber(price ? price : 0);
  if (isActive) {
    classes.push('active');
  }
  return (
    <StyledOrderAction className={classes.join(' ')} onClick={click}>
      <StyledTitle className={classes.join(' ')}>{title}</StyledTitle>
      <StyledPrice className={classes.join(' ')}>{priceWithLocale}</StyledPrice>
      <StyledAction className={classes.join(' ')}>{action}</StyledAction>
    </StyledOrderAction>
  );
};

export default OrderAction;
