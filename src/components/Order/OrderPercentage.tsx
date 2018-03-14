import * as React from 'react';
import styled from 'styled-components';

interface OrderPercentageProps {
  percent: number;
  isActive: boolean;
  onClick: any;
}

const StyledPercent = styled.div`
  color: #f5f6f7;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: 8px 24px;
  border: 1px solid transparent;
  border-left: 1px solid rgba(140, 148, 160, 0.4);

  &.active,
  &.active:first-child {
    border: 1px solid rgba(140, 148, 160, 0.4);
    border-radius: 4px;
  }

  &:first-child {
    border-left: 1px solid transparent;
  }

  &:hover,
  &.active + div:hover {
    border: 1px solid rgba(140, 148, 160, 0.4);
    border-left: 1px solid rgba(140, 148, 160, 0.4);
    border-radius: 4px;
    cursor: pointer;
  }

  &:hover + .active {
    border-left: 1px solid rgba(140, 148, 160, 0.4);
  }

  &:hover + div,
  &.active + div {
    border-left: 1px solid transparent;
  }
` as any;

const OrderPercentage: React.SFC<OrderPercentageProps> = ({
  percent,
  isActive,
  onClick
}) => {
  return (
    <StyledPercent className={isActive ? 'active' : ''} onClick={onClick}>
      {percent}%
    </StyledPercent>
  );
};

export default OrderPercentage;
