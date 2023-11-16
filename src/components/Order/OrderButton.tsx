import * as React from 'react';
import {ConfirmButton} from './styles';

interface OrderButtonProps {
  isDisable: boolean;
  type: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >['type'];
  message?: string;
}

const OrderButton: React.SFC<OrderButtonProps> = ({
  isDisable,
  type,
  message
}) => {
  return (
    <ConfirmButton type={type} disabled={isDisable}>
      {message}
    </ConfirmButton>
  );
};

export default OrderButton;
export {ConfirmButton};
