import {observable} from 'mobx';
import {equals} from 'rambda';
import * as React from 'react';
import {AnalyticsIds} from '../../services/analyticsService';
import {TileContent, TileHeader, TileTab} from './styles';
import {TileProps} from './Tile';

interface TabbedTileProps extends TileProps {
  tabs: string[];
}

class TabbedTile extends React.Component<TabbedTileProps> {
  @observable selectedIndex = 0;

  handleSelectTab = (idx: number) => (e: React.MouseEvent<any>) => {
    this.selectedIndex = idx;
  };

  render() {
    const {tabs = [], children} = this.props;
    return (
      <React.Fragment>
        <TileHeader>
          {tabs.map((tab, idx) => (
            <TileTab
              id={tab === 'My funds' ? AnalyticsIds.MyFundsTab : ''}
              key={tab}
              selected={equals(idx, this.selectedIndex)}
              onClick={this.handleSelectTab(idx)}
            >
              {tab}
            </TileTab>
          ))}
        </TileHeader>
        <TileContent>
          {React.Children.map(
            children,
            (child, idx) => (equals(idx, this.selectedIndex) ? child : null)
          )}
        </TileContent>
      </React.Fragment>
    );
  }
}

export default TabbedTile;
