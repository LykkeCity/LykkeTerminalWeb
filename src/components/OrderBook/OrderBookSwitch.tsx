import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {OrderBookDisplayType} from '../../models';
import ClickOutside from '../ClickOutside/ClickOutside';
import CustomSelect from '../Select/CustomSelect';
// import {capitalize} from '../../utils';
import {StyledSwitch} from './styles';

interface OrderBookSwitchProps {
  value: OrderBookDisplayType;
  onChange: (displayType: OrderBookDisplayType) => void;
}

const show = observable(false);

const OrderBookSwitch: React.SFC<OrderBookSwitchProps> = ({
  value,
  onChange
}: any) => {
  const toggle = () => {
    show.set(!show.get());
  };

  const handleClick = (val: string) => (e: any) => {
    toggle();
    onChange(val);
  };

  return (
    <StyledSwitch>
      <label onClick={toggle}>{value}</label>
      {show.get() && (
        <ClickOutside onClickOutside={toggle}>
          <CustomSelect
            styles={{
              borderRadius: '6px',
              height: '67px',
              left: '120px',
              minWidth: '150px',
              top: '45px'
            }}
            items={Object.keys(OrderBookDisplayType).map(x => ({
              label: x,
              value: x
            }))}
            activeValue={value}
            click={handleClick}
          />
        </ClickOutside>
      )}
    </StyledSwitch>
  );
};

export default observer(OrderBookSwitch);
