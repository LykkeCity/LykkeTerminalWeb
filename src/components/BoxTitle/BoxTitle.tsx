import * as React from 'react';
import BoxTitleItem from './BoxTitleItem/BoxTitleItem';

// tslint:disable-next-line:no-var-requires
const {Box} = require('grid-styled');

interface BoxTitleProps {
  tabs: any;
}

interface BoxTitleState {
  activeTabIndex: number;
}

class BoxTitle extends React.Component<BoxTitleProps, BoxTitleState> {
  constructor(props: BoxTitleProps) {
    super(props);
    this.state = {
      activeTabIndex: 0
    };
  }

  clickHandler = (index: number) => {
    if (!this.props.tabs.isTab) {
      return;
    }
    this.setState({
      activeTabIndex: index
    });
  };

  render() {
    return (
      <Box>
        {this.props.tabs.names.map((tab: string, index: number) => {
          return (
            <BoxTitleItem
              isClickable={this.props.tabs.isTab}
              key={`boxtitle_${index}`}
              tabName={tab}
              index={index}
              activeIndex={this.state.activeTabIndex}
              click={this.clickHandler.bind(this, index)}
            />
          );
        })}
      </Box>
    );
  }
}

export default BoxTitle;
