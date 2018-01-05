import * as React from 'react';
import {OrderActionProps} from './index';
import './orderAction.css';

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
    <div className={classes.join(' ')} onClick={click}>
      <div className="title">{title}</div>
      <div className="price">{price}</div>
      <div className="action">{action}</div>
    </div>
  );
};

export default OrderAction;
