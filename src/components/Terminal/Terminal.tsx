import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import keys from '../../constants/storageKeys';
import Widgets from '../../models/mosaicWidgets';
import {StorageUtils} from '../../utils/index';
import Backdrop from '../Backdrop/Backdrop';
import {Chart} from '../Chart/index';
import {Header} from '../Header';
import Modal from '../Modal/Modal';
import {MyWallets} from '../MyWallets';
import {NotificationList} from '../Notification';
import {Order} from '../Order';
import OrderBook from '../OrderBook';
import {Orders} from '../OrderList';
import styled, {colors} from '../styled';
import {TabbedTile, Tile} from '../Tile';
import {TradeLog, Trades} from '../TradeList';
import {TerminalProps} from './index';

const Shell = styled.div`
  background: ${colors.darkGraphite};
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
`;

const layoutStorage = StorageUtils(keys.layout);

const MAX_LEFT_PADDING = 20;
const MAX_RIGHT_PADDING = 75;
const MIN_PANE_SIZE_PERCENTAGE = 20;

const {
  ChartWidget,
  OrderWidget,
  OrderBookWidget,
  OrderListWidget,
  TradeListWidget
} = Widgets;

const ELEMENT_MAP: {[viewId: string]: JSX.Element} = {
  [ChartWidget]: (
    <Tile title="Chart">
      <Chart />
    </Tile>
  ),
  [TradeListWidget]: (
    <Tile title="Trade log">
      <TradeLog />
    </Tile>
  ),
  [OrderBookWidget]: (
    <Tile title="Order book">
      <OrderBook />
    </Tile>
  ),
  [OrderListWidget]: (
    <TabbedTile tabs={['Orders', 'Trades', 'My wallets']}>
      <Orders />
      <Trades />
      <MyWallets />
    </TabbedTile>
  ),
  [OrderWidget]: (
    <Tile title="Order" authorize={true}>
      <Order />
    </Tile>
  )
};

class Terminal extends React.Component<TerminalProps, {}> {
  state = {
    initialValue: {
      direction: 'row' as MosaicDirection,
      first: OrderWidget,
      second: {
        direction: 'row' as MosaicDirection,
        first: {
          direction: 'column' as MosaicDirection,
          first: ChartWidget,
          second: OrderListWidget,
          splitPercentage: 65
        },
        second: {
          direction: 'column' as MosaicDirection,
          first: OrderBookWidget,
          second: TradeListWidget,
          splitPercentage: 70
        },
        splitPercentage: MAX_RIGHT_PADDING
      },
      splitPercentage: MAX_LEFT_PADDING
    }
  };

  componentDidMount() {
    this.props.rootStore.start();
    const layout = layoutStorage.get();
    if (layout) {
      this.setState({
        initialValue: JSON.parse(layout)
      });
    }
    this.bindChartOverlayHandler();
  }

  bindChartOverlayHandler() {
    const mosaicSplitList = document.getElementsByClassName(
      'mosaic-split -column'
    );
    const mosaicSplit = Array.from(mosaicSplitList).find(
      item =>
        item.previousElementSibling!.querySelector('#tv_chart_container') !==
        null
    );
    if (mosaicSplit) {
      mosaicSplit.addEventListener('mouseup', () => {
        this.toggleChartOverlayHelper(false);
      });
      mosaicSplit.addEventListener('mousedown', () => {
        this.toggleChartOverlayHelper(true);
      });
    }
  }

  toggleChartOverlayHelper(show = false) {
    const transparentDiv = document.getElementById('transparentDiv');
    if (transparentDiv) {
      transparentDiv!.style.display = show ? 'block' : 'none';
    }
  }

  handleRenderTile = (id: string) => ELEMENT_MAP[id];

  handleChange = (args: any) => {
    this.setState({
      initialValue: args
    });
    layoutStorage.set(JSON.stringify(args));
  };

  render() {
    return (
      <Shell>
        <NotificationList />
        {this.props.rootStore.modalStore.isModals ? (
          <div>
            <Backdrop />
            <Modal modals={this.props.rootStore.modalStore.modals} />
          </div>
        ) : null}
        <Header history={this.props.history} />
        <Mosaic
          renderTile={this.handleRenderTile}
          onChange={this.handleChange}
          resize={{minimumPaneSizePercentage: MIN_PANE_SIZE_PERCENTAGE}}
          initialValue={this.state.initialValue}
        />
      </Shell>
    );
  }
}

export default Terminal;
