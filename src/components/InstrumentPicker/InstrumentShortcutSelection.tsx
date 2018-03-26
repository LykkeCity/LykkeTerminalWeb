import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import ClickOutside from '../ClickOutside/ClickOutside';
import CustomSelect from '../Select/CustomSelect';
import {InstrumentShortcutSelectionProps} from './index';

const StyledShortcutSelection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: ${rem(16)} 0;
  margin-left: ${rem(8)};
  text-align: left;
  color: rgb(245, 246, 247);

  &:after {
    content: '';
    margin: 0 10px;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-top: 4px solid #f5f6f7;
  }

  &.active {
    color: #0388ef;
    box-shadow: inset 0 -3px 0 0 #0388ef;
  }
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

const InstrumentShortcutSelection: React.SFC<
  InstrumentShortcutSelectionProps
> = ({
  toggleShortcuts,
  onToggleInstrumentSelection,
  selectedShortcut,
  shortcuts,
  showInstrumentSelection
}) => {
  const handleChange = (value: string, index: number) => () => {
    toggleShortcuts(value, index);
  };

  const currentOption = shortcuts.find(item => item.index === selectedShortcut);

  return (
    <Wrapper>
      <StyledShortcutSelection
        className={currentOption ? 'active' : ''}
        onClick={onToggleInstrumentSelection}
      >
        {currentOption ? currentOption.label : 'Other'}
      </StyledShortcutSelection>
      {showInstrumentSelection && (
        <ClickOutside
          onClickOutside={
            showInstrumentSelection ? onToggleInstrumentSelection : ''
          }
        >
          <CustomSelect
            styles={{
              borderRadius: '4px',
              height: '69px',
              minWidth: '150px',
              right: '175px',
              top: '45px'
            }}
            isActiveMarked={true}
            activeValue={currentOption ? currentOption!.value : ''}
            items={shortcuts}
            click={handleChange}
          />
        </ClickOutside>
      )}
    </Wrapper>
  );
};

export default InstrumentShortcutSelection;
