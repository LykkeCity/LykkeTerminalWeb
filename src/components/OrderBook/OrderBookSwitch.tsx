import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {OrderBookDisplayType} from '../../models';
import {AnalyticsService} from '../../services/analyticsService';
import ClickOutside from '../ClickOutside/ClickOutside';
import CustomSelect from '../Select/CustomSelect';
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
    if (val === OrderBookDisplayType.Volume) {
      AnalyticsService.handleClick(AnalyticsEvents.SwitchToVolume);
    } else {
      AnalyticsService.handleClick(AnalyticsEvents.SwitchToDepth);
    }
  };

  const items = Object.keys(OrderBookDisplayType).map(x => ({
    label: x,
    value: x
  }));

  return (
    <StyledSwitch>
      <label onClick={toggle}>{value}</label>
      {show.get() && (
        <ClickOutside onClickOutside={toggle}>
          <CustomSelect
            styles={{
              borderRadius: '6px',
              height: '70px',
              left: '120px',
              minWidth: '150px',
              top: '45px'
            }}
            items={items}
            isActiveMarked={true}
            activeValue={value}
            click={handleClick}
          />
        </ClickOutside>
      )}
    </StyledSwitch>
  );
};

export default observer(OrderBookSwitch);
