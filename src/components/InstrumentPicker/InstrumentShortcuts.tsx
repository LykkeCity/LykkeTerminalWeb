import * as React from 'react';
import styled from 'styled-components';
import shortcuts from '../../constants/shortcuts';
import {InstrumentShortcutsProps, InstrumentShortcutsStates} from './index';

const StyledShortcut = styled.span`
  margin-left: 10px;
  padding: 3px 5px;
  border-radius: 5px;

  &.active {
    background-color: #494949;
  }
  &:hover {
    cursor: pointer;
  }
`;

class InstrumentShortcuts extends React.Component<
  InstrumentShortcutsProps,
  InstrumentShortcutsStates
> {
  constructor(props: InstrumentShortcutsProps) {
    super(props);
    this.state = {
      activeIndex: null
    };
  }

  setActive = (index: number, value: string) => () => {
    this.setState({
      activeIndex: index
    });
    this.props.changeValue(value);
  };

  render() {
    return (
      <div>
        {shortcuts.map((shortcut: any, index: number) => {
          return (
            <StyledShortcut
              className={this.state.activeIndex === index ? 'active' : ''}
              key={`shortcutid_${index}`}
              onClick={this.setActive(index, shortcut.value)}
            >
              {shortcut.key}
            </StyledShortcut>
          );
        })}
      </div>
    );
  }
}

export default InstrumentShortcuts;
