import * as React from 'react';
import styled from 'styled-components';
import {OrdersSelection} from '../../../constants/ordersSelection';
import ClickOutside from '../../ClickOutside/ClickOutside';
import CustomSelect from '../../Select/CustomSelect';
import {ToggleOrdersProps} from './index';

const StyledOrdersSelection = styled.div`
  padding-right: 30px;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;

  font-size: 14px;
  text-align: left;
  color: rgb(245, 246, 247);

  &:first-letter {
    text-transform: capitalize;
  }

  &:hover {
    cursor: pointer;
  }

  &:after {
    content: '';
    position: absolute;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-top: 4px solid #f5f6f7;
    top: 7px;
    right: 13px;
  }
`;

const ToggleOrders: React.SFC<ToggleOrdersProps> = ({
  selectedOrderOptions,
  toggleOrders,
  toggleOrdersSelect,
  showOrdersSelect
}) => {
  const handleChange = (value: string) => () => {
    toggleOrders(value);
  };

  const currentOption = OrdersSelection.find(
    item => item.value === selectedOrderOptions
  );

  return (
    <div>
      <StyledOrdersSelection onClick={toggleOrdersSelect}>
        {currentOption!.label}
      </StyledOrdersSelection>
      {showOrdersSelect && (
        <ClickOutside onClickOutside={toggleOrdersSelect}>
          <CustomSelect
            styles={{
              borderRadius: '6px',
              height: '67px',
              minWidth: '150px',
              top: '37px'
            }}
            isActiveMarked={true}
            activeValue={currentOption!.value}
            items={OrdersSelection}
            click={handleChange}
          />
        </ClickOutside>
      )}
    </div>
  );
};

export default ToggleOrders;
