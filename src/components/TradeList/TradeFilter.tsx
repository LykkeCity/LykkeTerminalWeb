import {ClickOutside} from '@lykkecity/react-components';
import {observable} from 'mobx';
import {Observer} from 'mobx-react';
import * as React from 'react';
import CustomSelect, {Option} from '../Select/CustomSelect';
import {TradeFilterValue} from './styles';

export interface TradeFilterProps {
  value: string;
  options: Option[];
  hasSearch?: boolean;
  resetSearchLabel?: string;
  onFilter: (value: string) => void;
}

const TradeFilter: React.SFC<TradeFilterProps> = ({
  value,
  options,
  hasSearch,
  resetSearchLabel,
  onFilter
}) => {
  const show = observable.box(false);
  const toggle = () => show.set(!show.get());
  const handleClick = (newValue: string) => () => {
    toggle();
    onFilter(newValue);
  };
  let selectedValue = options.find(option => option.value === value);
  if (!selectedValue && resetSearchLabel) {
    selectedValue = {value: '', label: resetSearchLabel};
  }

  return (
    <Observer>
      {() => (
        <div>
          <TradeFilterValue onClick={toggle}>
            {selectedValue && selectedValue.label}
          </TradeFilterValue>
          {show.get() && (
            <ClickOutside onClickOutside={toggle}>
              <CustomSelect
                styles={{
                  borderRadius: '6px',
                  height: 'auto',
                  minWidth: '171px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  top: '37px'
                }}
                isActiveMarked={true}
                activeValue={value}
                items={options}
                hasSearch={hasSearch}
                needScroll={hasSearch}
                resetSearchLabel={resetSearchLabel}
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
