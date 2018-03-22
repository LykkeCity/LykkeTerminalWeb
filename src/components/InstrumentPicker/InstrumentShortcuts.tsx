import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {InstrumentShortcutSelection, InstrumentShortcutsProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledShortcutList = styled(Flex)`
  min-width: 450px;
  overflow: hidden;
  flex-wrap: wrap;
  font-size: 14px;
`;

const StyledOther = styled.div`
  display: flex;
  align-items: center;
  width: 70px;
  margin-right: ${rem(4)};

  &:hover {
    cursor: pointer;
  }
`;

const StyledShortcut = styled(StyledOther)`
  display: flex;
  align-items: center;
  width: 70px;
  margin: 0 ${rem(8)};
  padding: ${rem(16)} 0;
  overflow: hidden;

  &:first-child {
    margin-left: 0px;
  }

  &.active {
    color: #0388ef;
    box-shadow: inset 0 -3px 0 0 #0388ef;
  }
`;

class InstrumentShortcuts extends React.Component<InstrumentShortcutsProps> {
  private otherShortcuts: any[];
  private shortcutsNum: number = 5;

  constructor(props: InstrumentShortcutsProps) {
    super(props);
  }

  handleClick = (value: string, index: number) => () => {
    this.props.changeValue(value, index);
  };

  handleShortcutSelection = (value: string, index: number) => {
    this.props.changeValue(value, index);

    if (this.props.showInstrumentSelection) {
      setTimeout(this.props.onToggleInstrumentSelection);
    }
  };

  sortShorcuts = () => {
    if (this.props.shortcuts.length > this.shortcutsNum) {
      this.otherShortcuts = this.props.shortcuts
        .splice(this.shortcutsNum)
        .map((shortcut, index) => ({
          index: this.shortcutsNum + index,
          label: shortcut,
          value: shortcut
        }));
    }
  };

  render() {
    this.sortShorcuts();

    return (
      <StyledShortcutList>
        {this.props.shortcuts.map((shortcut: string, index: number) => (
          <StyledShortcut
            className={this.props.shortcutActiveIndex === index ? 'active' : ''}
            key={`shortcutid_${index}`}
            onClick={this.handleClick(shortcut, index)}
          >
            {shortcut}
          </StyledShortcut>
        ))}
        {this.otherShortcuts && (
          <StyledOther>
            <InstrumentShortcutSelection
              toggleShortcuts={this.handleShortcutSelection}
              onToggleInstrumentSelection={
                this.props.onToggleInstrumentSelection
              }
              selectedShortcut={this.props.shortcutActiveIndex!}
              shortcuts={this.otherShortcuts}
              showInstrumentSelection={this.props.showInstrumentSelection}
            />
          </StyledOther>
        )}
      </StyledShortcutList>
    );
  }
}

export default InstrumentShortcuts;
