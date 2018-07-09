import * as React from 'react';
import {Percent} from './styles';

interface OrderPercentageProps {
  percent: number;
  isActive: boolean;
  onClick: any;
  isDisabled: boolean;
}

const OrderPercentage: React.SFC<OrderPercentageProps> = ({
  percent,
  isActive,
  onClick,
  isDisabled
}) => {
  return (
    <Percent
      className={`${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={onClick}
    >
      <div>{percent}%</div>
    </Percent>
  );
};

export default OrderPercentage;
