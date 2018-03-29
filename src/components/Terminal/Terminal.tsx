import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import keys from '../../constants/storageKeys';
import tabs from '../../constants/tabs';
import Widgets from '../../models/mosaicWidgets';
import {StorageUtils} from '../../utils/index';
import {Account} from '../Account';
import Backdrop from '../Backdrop/Backdrop';
import {Chart} from '../Chart/index';
import {Header} from '../Header';
import Modal from '../Modal/Modal';
import {NotificationList} from '../Notification';
import {Order} from '../Order';
import OrderBook from '../OrderBook';
import {Orders} from '../OrderList';
import styled, {colors} from '../styled';
import {TabbedTile, Tile} from '../Tile';
import {TradeLog, Trades} from '../TradeList';
import {TerminalProps} from './index';

const MAX_LEFT_PADDING = 20;
const MAX_RIGHT_PADDING = 75;

const Shell = styled.div`
  background: ${colors.darkGraphite};
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
`;

const {
  AccountWidget,
  ChartWidget,
  OrderWidget,
  OrderBookWidget,
  OrderListWidget,
  TradeListWidget
} = Widgets;

const layoutStorage = StorageUtils(keys.layout);
const ELEMENT_MAP: {[viewId: string]: JSX.Element} = {
  [AccountWidget]: (
    <Tile title="Account" tabs={tabs.walletBalance} authorize={true}>
      <Account />
    </Tile>
  ),
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
    <TabbedTile tabs={['Orders', 'Trades']}>
      <Orders />
      <Trades />
    </TabbedTile>
  ),
  [OrderWidget]: (
    <Tile title="Order" authorize={true}>
      <Order />
    </Tile>
  )
};

class Terminal extends React.Component<TerminalProps, {initialValue: any}> {
  private unlisten: any;
  private initialValue: any = {
    direction: 'row' as MosaicDirection,
    first: {
      direction: 'column' as MosaicDirection,
      first: OrderWidget,
      second: AccountWidget,
      splitPercentage: 60
    },
    second: {
      direction: 'row' as MosaicDirection,
      first: {
        direction: 'column' as MosaicDirection,
        first: ChartWidget,
        second: OrderListWidget,
        splitPercentage: 70
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
  };

  constructor(props: TerminalProps) {
    super(props);

    this.state = {
      initialValue: this.initialValue
    };
  }

  componentWillMount() {
    const layout = layoutStorage.get();
    if (layout) {
      this.initialValue = JSON.parse(layout);
    }
  }

  componentDidMount() {
    this.props.rootStore.start();
  }

  handleRenderTile = (id: string) => ELEMENT_MAP[id];

  handleChange = (args: any) => {
    if (args.splitPercentage > MAX_LEFT_PADDING) {
      args.splitPercentage = MAX_LEFT_PADDING;
    } else if (args.second.splitPercentage < MAX_RIGHT_PADDING) {
      args.second.splitPercentage = MAX_RIGHT_PADDING;
    }

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
          resize={{minimumPaneSizePercentage: 25}}
          value={this.state.initialValue}
        />
      </Shell>
    );
  }
}

export default Terminal;
