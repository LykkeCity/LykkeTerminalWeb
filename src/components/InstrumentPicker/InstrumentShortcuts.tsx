import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {InstrumentShortcutsProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledShortcutList = styled(Flex)`
  width: 200px;
  overflow: hidden;
  flex-wrap: wrap;
  height: 22px;
`;

const StyledShortcut = styled.div`
  padding: ${rem(4)} ${rem(8)};
  border-left: 1px solid rgba(0, 0, 0, 0.2);

  &:first-child {
    margin-left: 0px;
    border-left: none;
  }

  &:last-child {
    margin-right: ${rem(4)};
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
      </StyledShortcutList>
    );
  }
}

export default InstrumentShortcuts;
