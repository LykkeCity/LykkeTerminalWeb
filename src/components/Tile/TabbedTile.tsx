import {observable} from 'mobx';
import {equals} from 'rambda';
import * as React from 'react';
import {TileContent, TileHeader, TileTab} from './styles';
import {TileProps} from './Tile';

interface TabbedTileProps extends TileProps {
  tabs: string[];
  className?: string;
}

class TabbedTile extends React.Component<TabbedTileProps> {
  @observable selectedIndex = 0;

  handleSelectTab = (idx: number) => () => {
    this.selectedIndex = idx;
  };

  render() {
    const {tabs = [], className, children} = this.props;
    return (
      <React.Fragment>
        <TileHeader className={className}>
          {tabs.map((tab, idx) => (
            <TileTab
              key={tab}
              selected={equals(idx, this.selectedIndex)}
              onClick={this.handleSelectTab(idx)}
            >
              {tab}
            </TileTab>
          ))}
        </TileHeader>
        <TileContent className={className}>
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
