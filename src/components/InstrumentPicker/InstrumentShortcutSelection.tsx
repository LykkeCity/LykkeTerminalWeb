import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import ClickOutside from '../ClickOutside/ClickOutside';
import CustomSelect from '../Select/CustomSelect';
import {InstrumentShortcutSelectionProps} from './index';
import {
  ShortcutSelection,
  ShortcutSelectionWrapper,
  ShortcutTruncatedText
} from './styles';

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
    <ShortcutSelectionWrapper>
      <ShortcutSelection
        className={currentOption ? 'active' : ''}
        onClick={onToggleInstrumentSelection}
      >
        <ShortcutTruncatedText
          data-tip={currentOption ? currentOption.label : 'Other'}
        >
          {currentOption ? currentOption.label : 'Other'}
        </ShortcutTruncatedText>
      </ShortcutSelection>
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
      <ReactTooltip effect={'solid'} />
    </ShortcutSelectionWrapper>
  );
};

export default InstrumentShortcutSelection;
