import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import additionalActions from '../../constants/additionalActions';
import paths from '../../constants/paths';
import keys from '../../constants/storageKeys';
import tabs from '../../constants/tabs';
import Widgets from '../../models/mosaicWidgets';
import {StorageUtils} from '../../utils/index';
import Backdrop from '../Backdrop/Backdrop';
import {BalanceList} from '../BalanceList';
import {Chart} from '../Chart/index';
import {Header} from '../Header';
import Modal from '../Modal/Modal';
import {NotificationList} from '../Notification';
import {Order} from '../Order';
import OrderBook from '../OrderBook';
import {OrderList} from '../OrderList';
import styled from '../styled';
import {TabbedTile, Tile} from '../Tile';
import {PublicTradeList, TradeList} from '../TradeList';
import {WalletBalanceList} from '../WalletBalanceList';
import {TerminalProps} from './index';

const MAX_LEFT_PADDING = 20;
const MAX_RIGHT_PADDING = 80;

const Shell = styled.div`
  background: rgba(0, 0, 0, 0.2);
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
      <WalletBalanceList />
      <BalanceList />
    </Tile>
  ),
  [ChartWidget]: (
    <Tile title="Chart">
      <Chart />
    </Tile>
  ),
  [TradeListWidget]: (
    <Tile title="Trade log">
      <PublicTradeList />
    </Tile>
  ),
  [OrderBookWidget]: (
    <Tile title="Order book">
      <OrderBook />
    </Tile>
  ),
  [OrderListWidget]: (
    <TabbedTile
      tabs={['Orders', 'Trades']}
      authorize={true}
      additionalControls={additionalActions.orders}
    >
      <OrderList />
      <TradeList />
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
    this.unlisten = this.props.history.listen((location: any) => {
      if (location.pathname === paths.signin) {
        this.props.rootStore.reset();
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

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

  handleOuterClick = () => {
    if (this.props.rootStore.settingsStore.settings) {
      document.querySelector('.settings')!.classList.remove('active');
      this.props.rootStore.settingsStore.toggleSettings();
    }
  };

  render() {
    return (
      <Shell onClick={this.handleOuterClick}>
        <NotificationList />
        {this.props.rootStore.modalStore.isModals ? (
          <div>
            <Backdrop />
            <Modal modals={this.props.rootStore.modalStore.modals} />
          </div>
        ) : null}
        <Header history={this.props.history} />
        <Mosaic
          // tslint:disable-next-line:jsx-no-lambda
          renderTile={(id, path) => ELEMENT_MAP[id]}
          onChange={this.handleChange}
          resize={{minimumPaneSizePercentage: 20}}
          value={this.state.initialValue}
        />
      </Shell>
    );
  }
}

export default Terminal;
