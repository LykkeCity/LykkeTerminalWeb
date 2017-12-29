import * as React from 'react';
import {OrderOptionProps} from '../index';
import './orderOption.css';
import OrderTumbler from './OrderTumbler/OrderTumbler';

const OrderOption: React.SFC<OrderOptionProps> = ({
  title,
  isOptional,
  tumblerValues,
  change,
  inputValue
}) => {
  return (
    <div className={'title-wrap'}>
      <div>
        {isOptional ? (
          <input type="checkbox" /> // todo have to be styled
        ) : null}
        <span className={'title'}>{title}</span>
      </div>
      <div className={'options'}>
        <OrderTumbler tumblers={tumblerValues} />
        <div className={'input-wrap'}>
          <input type="number" min="0" onChange={change} value={inputValue} />
        </div>
      </div>
    </div>
  );
};

export default OrderOption;
