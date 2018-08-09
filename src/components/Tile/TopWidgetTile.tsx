import {observable} from 'mobx';
import {equals} from 'rambda';
import * as React from 'react';
import {Chart} from '../Chart/index';
import DepthChart from '../DepthChart';
import {TileContent, TileHeader, TileTab} from './styles';
import {TileProps} from './Tile';

import {Order} from '../Order';
import OrderBook from '../OrderBook';

interface ChartTabbedTileProps extends TileProps {
  tabs: string[];
}

enum TopWidgetTabs {
  Price = 'Price chart',
  Depth = 'Depth chart',
  Order = 'Order',
  OrderBook = 'Order book'
}

class TopWidgetTile extends React.Component<ChartTabbedTileProps> {
  @observable selectedTab = TopWidgetTabs.Order;

  handleSelectTab = (tab: TopWidgetTabs) => (e: React.MouseEvent<any>) => {
    this.selectedTab = tab;
  };

  render() {
    const {tabs = []} = this.props;

    return (
      <React.Fragment>
        <TileHeader>
          {tabs.map((tab: TopWidgetTabs) => (
            <TileTab
              key={tab}
              selected={equals(tab, this.selectedTab)}
              onClick={this.handleSelectTab(tab)}
            >
              {tab}
            </TileTab>
          ))}
        </TileHeader>

        {this.selectedTab === TopWidgetTabs.Order && (
          <TileContent>
            <Order />
          </TileContent>
        )}
        <TileContent
          style={{
            display: this.selectedTab === TopWidgetTabs.Price ? 'block' : 'none'
          }}
        >
          <Chart />
        </TileContent>
        {this.selectedTab === TopWidgetTabs.Depth && (
          <TileContent>
            <DepthChart />
          </TileContent>
        )}
        {this.selectedTab === TopWidgetTabs.OrderBook && (
          <TileContent>
            <OrderBook />
          </TileContent>
        )}
      </React.Fragment>
    );
  }
}

export default TopWidgetTile;
