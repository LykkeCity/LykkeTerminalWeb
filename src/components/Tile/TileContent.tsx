import {lighten, rem} from 'polished';
import * as React from 'react';
import styled, {css} from '../styled';
import {TileTabItem} from './';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface TileContentProps {
  tabs: any;
  children: any;
}

interface TileContentState {
  activeTabIndex: number;
}

const iconCss = css`
  i {
    cursor: pointer;
    color: #d8d8d8;
    &:hover {
      color: ${lighten(0.2)('#d8d8d8')};
    }
  }
`;

const TileToolbar = styled.div`
  position: absolute;
  left: 0;
  top: 30px;
  width: 100%;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  padding: ${rem(15)} 0.9375rem ${rem(10)};
  ${iconCss};
  background-color: #333;
  z-index: 1;
`;

const StyledTileContent = styled.div`
  font-size: ${rem(14)};
  padding: ${rem(10)} ${rem(15)};
  height: calc(100% - 30px);
  min-height: calc(100% - 30px);
  margin-top: 30px;
`;

class TileContent extends React.Component<TileContentProps, TileContentState> {
  constructor(props: TileContentProps) {
    super(props);
    this.state = {
      activeTabIndex: 0
    };
  }

  handleClick = (index: number) => () => {
    if (!this.props.children.length) {
      return;
    }
    this.setState({
      activeTabIndex: index
    });
  };

  render() {
    const child = this.props.children.length
      ? this.props.children[this.state.activeTabIndex]
      : this.props.children;
    return (
      <StyledTileContent>
        {this.props.tabs && (
          <TileToolbar>
            <Flex align="center" justify="space-between">
              <Flex align="center">
                {this.props.tabs.map((tab: string, index: number) => {
                  return (
                    <TileTabItem
                      isClickable={!!child}
                      key={`tiletabitem_${index}`}
                      tabName={tab}
                      index={index}
                      activeIndex={this.state.activeTabIndex}
                      click={this.handleClick(index)}
                    />
                  );
                })}
              </Flex>
            </Flex>
          </TileToolbar>
        )}
        <div style={this.props.tabs ? {marginTop: rem(50)} : {height: '100%'}}>
          {child}
        </div>
      </StyledTileContent>
    );
  }
}

export default TileContent;
