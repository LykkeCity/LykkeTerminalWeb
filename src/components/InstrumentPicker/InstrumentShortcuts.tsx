import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import ClickOutside from '../ClickOutside/ClickOutside';
import CustomSelect from '../Select/CustomSelect';
import {InstrumentShortcutsProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledShortcutList = styled(Flex)`
  min-width: 450px;
  overflow: hidden;
  flex-wrap: wrap;
  font-size: 14px;
`;

const StyledShortcut = styled.div`
  display: flex;
  align-items: center;
  width: 70px;
  margin: 0 ${rem(8)};
  padding: ${rem(16)} 0;
  overflow: hidden;

  &:first-child {
    margin-left: 0px;
  }

  &:last-child {
    margin-right: ${rem(4)};
  }

  &.active {
    color: #0388ef;
    box-shadow: inset 0 -3px 0 0 #0388ef;
  }

  &:hover {
    cursor: pointer;
  }
`;

const StyledShortcutSelection = styled.div`
  padding-right: 30px;
  position: relative;
  text-align: left;
  color: rgb(245, 246, 247);
  border-right: 1px solid rgba(0, 0, 0, 0.2);

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

class InstrumentShortcuts extends React.Component<InstrumentShortcutsProps> {
  private otherShortcuts: any[];
  private shortcutsNum: number = 5;

  constructor(props: InstrumentShortcutsProps) {
    super(props);
  }

  handleClick = (value: string, index: number) => () => {
    this.props.changeValue(value, index);
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
          <ClickOutside onClickOutside={this.props.onToggleInstrumentSelection}>
            <StyledShortcut>
              <StyledShortcutSelection
                onClick={this.props.onToggleInstrumentSelection}
              >
                Other
              </StyledShortcutSelection>
              {this.props.showInstrumentSelection && (
                <CustomSelect
                  styles={{
                    borderRadius: '4px',
                    height: '60px',
                    minWidth: '150px',
                    top: '45px'
                  }}
                  isActiveMarked={true}
                  items={this.otherShortcuts}
                  click={this.handleClick}
                />
              )}
            </StyledShortcut>
          </ClickOutside>
        )}
      </StyledShortcutList>
    );
  }
}

export default InstrumentShortcuts;
