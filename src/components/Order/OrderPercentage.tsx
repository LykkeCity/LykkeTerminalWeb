import * as React from 'react';
import styled from 'styled-components';

interface OrderPercentageProps {
  percent: number;
  isActive: boolean;
  onClick: any;
  index: number;
}

const StyledPercent = styled.div.attrs({
  style: (props: any) => ({
    border: `1px solid ${
      props.isActive ? 'rgba(140, 148, 160, 0.4)' : 'transparent'
    }`,
    borderLeft: `${
      props.isFirst && !props.isActive
        ? 'none'
        : '1px solid rgba(140, 148, 160, 0.4)'
    }`,
    borderRadius: `${props.isActive ? '4px' : '0px'}`
  })
})`
  color: #f5f6f7;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: 8px 24px;

  &:hover {
    border: 1px solid rgba(140, 148, 160, 0.4) !important;
    border-left: 1px solid rgba(140, 148, 160, 0.4) !important;
    border-radius: 4px !important;
    cursor: pointer;
  }

  &:hover + div,
  &.active + div {
    border-left: 1px solid transparent !important;
  }
` as any;

const OrderPercentage: React.SFC<OrderPercentageProps> = ({
  percent,
  isActive,
  onClick,
  index
}) => {
  return (
    <StyledPercent
      isActive={isActive}
      isFirst={index === 0}
      className={isActive ? 'active' : ''}
      onClick={onClick}
    >
      {percent}%
    </StyledPercent>
  );
};

export default OrderPercentage;
