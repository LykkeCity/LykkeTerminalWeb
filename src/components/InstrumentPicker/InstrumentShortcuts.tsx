import * as React from 'react';
import styled from 'styled-components';
import {InstrumentShortcutsProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledShortcut = styled.div`
  padding: 3px 7px;
  border-left: 1px solid rgba(0, 0, 0, 0.2);

  &:first-child {
    margin-left: 0px;
    border-left: none;
  }

  &.active {
    color: #0388ef;
  }

  &:hover {
    cursor: pointer;
  }
`;

class InstrumentShortcuts extends React.Component<InstrumentShortcutsProps> {
  constructor(props: InstrumentShortcutsProps) {
    super(props);
  }

  handleClick = (value: string, index: number) => () => {
    this.props.changeValue(value, index);
  };

  render() {
    return (
      <Flex>
        {this.props.shortcuts.map((shortcut: string, index: number) => {
          return (
            <StyledShortcut
              className={
                this.props.shortcutActiveIndex === index ? 'active' : ''
              }
              key={`shortcutid_${index}`}
              onClick={this.handleClick(shortcut, index)}
            >
              {shortcut}
            </StyledShortcut>
          );
        })}
      </Flex>
    );
  }
}

export default InstrumentShortcuts;
