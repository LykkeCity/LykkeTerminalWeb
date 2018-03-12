import * as React from 'react';
import styled from 'styled-components';

interface OrderPercentageProps {
  percent: number;
  isActive: boolean;
  onClick: any;
}

const StyledPercent = styled.div.attrs({
  style: (props: any) => ({
    color: '#f5f6f7'
  })
})`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: 8px 24px;
  border: 1px solid transparent;
  border-right: 1px solid rgba(140, 148, 160, 0.4);

  &:last-child {
    border-right: none;
  }

  &:hover {
    border: 1px solid rgba(140, 148, 160, 0.4);
    border-radius: 4px;
    cursor: pointer;
  }
` as any;

const OrderPercentage: React.SFC<OrderPercentageProps> = ({
  percent,
  isActive,
  onClick
}) => {
  return (
    <StyledPercent isActive={isActive} onClick={onClick}>
      {percent}%
    </StyledPercent>
  );
};

export default OrderPercentage;
