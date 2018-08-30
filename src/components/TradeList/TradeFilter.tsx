import {ClickOutside} from '@lykkex/react-components';
import {observable} from 'mobx';
import {Observer} from 'mobx-react';
import * as React from 'react';
import CustomSelect, {Option} from '../Select/CustomSelect';
import {TradeFilterValue} from './styles';

export interface TradeFilterProps {
  value: string;
  options: Option[];
  onFilter: (value: string) => void;
}

const TradeFilter: React.SFC<TradeFilterProps> = ({
  value,
  options,
  onFilter
}) => {
  const show = observable.box(false);
  const toggle = () => show.set(!show.get());
  const handleClick = (newValue: string) => () => onFilter(newValue);
  return (
    <Observer>
      {() => (
        <div>
          <TradeFilterValue onClick={toggle}>{value}</TradeFilterValue>
          {show.get() && (
            <ClickOutside onClickOutside={toggle}>
              <CustomSelect
                styles={{
                  borderRadius: '6px',
                  height: '67px',
                  minWidth: '150px',
                  top: '37px'
                }}
                isActiveMarked={true}
                activeValue={value}
                items={options}
                click={handleClick}
              />
            </ClickOutside>
          )}
        </div>
      )}
    </Observer>
  );
};

TradeFilter.displayName = 'TradeFilter';

export default TradeFilter;
