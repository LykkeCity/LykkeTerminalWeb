import * as React from 'react';
import styled from 'styled-components';

const shortcuts = [
  {
    key: 'All',
    value: '*'
  },
  {
    key: '*/EUR',
    value: '*/EUR'
  },
  {
    key: '*/USD',
    value: '*/USD'
  },
  {
    key: '*/ETH',
    value: '*/ETH'
  }
];

const StyledShortcut = styled.span`
  margin-left: 10px;

  &.active {
    background-color: #ccc;
  }
  &:hover {
    cursor: pointer;
  }
`;

interface InstrumentShortcutsStates {
  activeIndex: any;
}

class InstrumentShortcuts extends React.Component<
  {onSearch: any},
  InstrumentShortcutsStates
> {
  constructor(props: {onSearch: any}) {
    super(props);
    this.state = {
      activeIndex: null
    };
  }

  setActive = (index: number, value: string) => () => {
    this.setState({
      activeIndex: index
    });
    this.props.onSearch(value);
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
