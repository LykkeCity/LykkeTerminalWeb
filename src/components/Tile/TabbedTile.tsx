import {observable} from 'mobx';
import {equals} from 'rambda';
import * as React from 'react';
import {TileContent, TileProps} from './index';
import {TileHeader, TileTitle, TileWrapper} from './Tile';

const TileTab = TileTitle.extend`
  background: ${(p: any) => (p.active ? '#333' : '#292929')};
  border-bottom: solid 1px rgba(0, 0, 0, 0.3);
  border-color: ${(p: any) => (p.active ? '#333' : '#292929')};
  cursor: pointer;
`;

interface TabbedTileProps extends TileProps {
  tabs: string[];
}

class TabbedTile extends React.Component<TabbedTileProps> {
  @observable selectedIndex = 0;

  handleSelectTab = (idx: number) => (e: React.MouseEvent<any>) => {
    this.selectedIndex = idx;
  };

  render() {
    const {tabs = [], children, ...props} = this.props;
    return (
      <TileWrapper>
        <TileHeader justify="left">
          {tabs.map((tab, idx) => (
            <TileTab
              key={tab}
              active={equals(idx, this.selectedIndex)}
              onClick={this.handleSelectTab(idx)}
            >
              {tab}
            </TileTab>
          ))}
        </TileHeader>
        <TileContent tabs={undefined} {...props}>
          {React.Children.map(
            children,
            (child, idx) => (equals(idx, this.selectedIndex) ? child : null)
          )}
        </TileContent>
      </TileWrapper>
    );
  }
}

export default TabbedTile;
