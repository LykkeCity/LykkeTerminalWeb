import * as React from 'react';
import styled from 'styled-components';

interface OrderPercentageProps {
  percent: number;
  isActive: boolean;
  onClick: any;
}

const StyledPercent = styled.div.attrs({
  style: (props: any) => ({
    backgroundColor: props.isActive ? '#fff' : 'transparent',
    color: props.isActive ? '#333333' : '#f5f6f7'
  })
})`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 76px;
  padding: 8px 24px;
  border: 1px dashed rgba(140, 148, 160, 0.4);

  &:hover {
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
