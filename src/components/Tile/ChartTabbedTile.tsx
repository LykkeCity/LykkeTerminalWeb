import {observable} from 'mobx';
import {equals} from 'rambda';
import * as React from 'react';
import {ChartType} from '../../models';
import {Chart} from '../Chart/index';
import DepthChart from '../DepthChart';
import {TileContent, TileHeader, TileTab} from './styles';
import {TileProps} from './Tile';

interface ChartTabbedTileProps extends TileProps {
  tabs: string[];
}

class ChartTabbedTile extends React.Component<ChartTabbedTileProps> {
  @observable selectedTab = ChartType.Price;

  handleSelectTab = (tab: ChartType) => (e: React.MouseEvent<any>) => {
    this.selectedTab = tab;
  };

  render() {
    const {tabs = []} = this.props;

    return (
      <React.Fragment>
        <TileHeader>
          {tabs.map((tab: ChartType) => (
            <TileTab
              key={tab}
              selected={equals(tab, this.selectedTab)}
              onClick={this.handleSelectTab(tab)}
            >
              {tab}
            </TileTab>
          ))}
        </TileHeader>

        <TileContent
          style={{
            display: this.selectedTab === ChartType.Price ? 'block' : 'none'
          }}
        >
          <Chart />
        </TileContent>

        {this.selectedTab === ChartType.Depth && (
          <TileContent>
            <DepthChart />
          </TileContent>
        )}
      </React.Fragment>
    );
  }
}

export default ChartTabbedTile;
