import {lighten, rem} from 'polished';
import * as React from 'react';
import Icon from '../../Icon/Icon';
import styled, {css} from '../../styled';
import TileTabItem from './TileTabItem/TileTabItem';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

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
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  padding: ${rem(10)} 0;
  ${iconCss};
`;

const TileContentDiv = styled.div`
  font-size: ${rem(14)};
  padding: ${rem(10)} ${rem(15)};
`;

class TileContent extends React.Component<TileContentProps, TileContentState> {
  constructor(props: TileContentProps) {
    super(props);
    this.state = {
      activeTabIndex: 0
    };
  }

  clickHandler = (index: number) => {
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
      <TileContentDiv>
        <TileToolbar>
          <Flex align="center" justify="space-between">
            <Box>
              {this.props.tabs.map((tab: string, index: number) => {
                return (
                  <TileTabItem
                    isClickable={!!this.props.children.length}
                    key={`tiletabitem_${index}`}
                    tabName={tab}
                    index={index}
                    activeIndex={this.state.activeTabIndex}
                    click={this.clickHandler.bind(this, index)}
                  />
                );
              })}
            </Box>
            <Box>
              <Icon name="cog" />
            </Box>
          </Flex>
        </TileToolbar>
        {child}
      </TileContentDiv>
    );
  }
}

export default TileContent;
