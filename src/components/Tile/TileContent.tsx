import {lighten, rem} from 'polished';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled, {css} from '../styled';
import {TileTabItem} from './';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface TileContentProps {
  additionalControls?: any;
  children: any;
  isAuth: any;
  tabs: any;
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
  top: ${rem(37)};
  width: 100%;
  padding: 0 ${rem(15)};
  background-color: #333;
  z-index: 1;
  ${iconCss};

  > div {
    border-bottom: solid 1px #292929;
    padding: ${rem(15)} 0;
  }
`;

const StyledTileContent = styled.div`
  font-size: ${rem(14)};
  height: calc(100% - ${rem(37)});
  min-height: calc(100% - ${rem(37)});
  margin-top: ${rem(37)};
`;

const margin = 54;
const calcHeight = (hasTabs: boolean, hasAdditionalControls: boolean) => {
  if (hasTabs && hasAdditionalControls) {
    return `calc(100% - ${rem(margin * 2)})`;
  } else if (hasTabs || hasAdditionalControls) {
    return `calc(100% - ${rem(margin)})`;
  } else {
    return '100%';
  }
};
const calcMarginTop = (hasTabs: boolean, hasAdditionalControls: boolean) => {
  if (hasTabs && hasAdditionalControls) {
    return rem(margin * 2);
  } else if (hasTabs || hasAdditionalControls) {
    return rem(margin);
  } else {
    return '';
  }
};

const StyledChild = styled.div.attrs({
  style: (props: any) => ({
    height: calcHeight(props.hasTabs, props.hasAdditionalControls),
    marginTop: calcMarginTop(props.hasTabs, props.hasAdditionalControls)
  })
})`
  padding: ${rem(10)} ${rem(15)};
` as any;

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

  componentWillReceiveProps(curent: any, next: any) {
    if (!next.isAuth) {
      this.setState({
        activeTabIndex: 0
      });
    }
  }

  render() {
    const child = this.props.children.length
      ? this.props.children[this.state.activeTabIndex]
      : this.props.children;
    return (
      <StyledTileContent>
        {this.props.tabs && (
          <TileToolbar>
            <Flex align="center" justify="space-between">
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
          </TileToolbar>
        )}
        {this.props.isAuth
          ? this.props.additionalControls && (
              <TileToolbar>
                <Flex align="center" justify="space-between" width="100%">
                  {this.props.additionalControls.map(
                    (Control: any, index: number) => {
                      return <Control key={index} />;
                    }
                  )}
                </Flex>
              </TileToolbar>
            )
          : null}
        <Scrollbars autoHide={true}>
          <StyledChild
            hasTabs={this.props.tabs}
            hasAdditionalControls={this.props.additionalControls}
          >
            {child}
          </StyledChild>
        </Scrollbars>
      </StyledTileContent>
    );
  }
}

export default TileContent;
