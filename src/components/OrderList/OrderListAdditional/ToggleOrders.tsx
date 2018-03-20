import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrdersSelection} from '../../../constants/ordersSelection';
import ClickOutside from '../../ClickOutside/ClickOutside';
import CustomSelect from '../../Select/CustomSelect';
import {colors, fonts} from '../../styled';
import {ToggleOrdersProps} from './index';

const StyledOrdersSelection = styled.div`
  position: relative;
  font-size: ${rem(fonts.normal)};
  color: ${colors.white};

  &:first-letter {
    text-transform: capitalize;
  }

  &:hover {
    cursor: pointer;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-top: 4px solid rgba(245, 246, 247, 0.4);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: relative;
    top: 10px;
    left: 10px;
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
