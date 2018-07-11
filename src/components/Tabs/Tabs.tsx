import * as React from 'react';
import {HBar} from '../Bar';
import {
  StyledTabContainer,
  StyledTabContainerLabels,
  StyledTabTitle
} from './styles';

interface TabsProps {
  children: any;
}

interface TabsState {
  activeTab: number;
}

class Tabs extends React.Component<TabsProps, TabsState> {
  constructor(props: TabsProps) {
    super(props);

    this.state = {
      activeTab: 0
    };
  }

  onTabChange(index: number) {
    this.setState({
      activeTab: index
    });
  }

  get tabs() {
    return [].concat(this.props.children);
  }

  render() {
    return (
      <StyledTabContainer>
        <StyledTabContainerLabels>
          {this.tabs.map((tab: any, index: number) => (
            <StyledTabTitle
              className={this.state.activeTab === index ? 'active' : ''}
              key={`tab_${index}`}
              onClick={this.onTabChange.bind(this, index)}
            >
              {tab.props.title}
            </StyledTabTitle>
          ))}
        </StyledTabContainerLabels>
        <HBar />
        {this.tabs[this.state.activeTab]}
      </StyledTabContainer>
    );
  }
}

export default Tabs;
