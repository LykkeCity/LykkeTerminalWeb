import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import paths from '../../constants/paths';
import {keys} from '../../models';
import Widgets from '../../models/mosaicWidgets';
import {AuthStore, BalanceListStore, ReferenceStore} from '../../stores';
import {StorageUtils} from '../../utils/index';
import Backdrop from '../Backdrop/Backdrop';
import {Header} from '../Header';
import Modal from '../Modal/Modal';
import {MyWallets} from '../MyWallets';
import {NotificationList} from '../Notification';
import {Order} from '../Order';
import OrderBook from '../OrderBook';
import {Orders} from '../OrderList';
import {SessionNotificationComponent} from '../Session';
import styled, {colors} from '../styled';
import {ChartTabbedTile, TabbedTile, Tile} from '../Tile';
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
    <ChartTabbedTile tabs={['Price chart', 'Depth chart']} authorize={false} />
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
    <TabbedTile tabs={['Orders', 'Trades', 'My funds']}>
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

  private authStore: AuthStore = this.props.rootStore.authStore;
  private balanceListStore: BalanceListStore = this.props.rootStore
    .balanceListStore;
  private referenceStore: ReferenceStore = this.props.rootStore.referenceStore;

  componentDidMount() {
    this.start().then(resp => {
      if (!resp) {
        return;
      }
      const layout = layoutStorage.get();
      if (layout) {
        this.setState({
          initialValue: Object.assign(
            this.state.initialValue,
            JSON.parse(layout)
          )
        });
      }
      this.bindChartOverlayHandler();
    });
  }

  bindChartOverlayHandler() {
    const firstColSplitter = document.getElementsByClassName(
      'mosaic-split -column'
    )[0];
    const rowSplitters = document.getElementsByClassName('mosaic-split -row');
    const splitters = [...Array.from(rowSplitters), firstColSplitter];
    if (splitters) {
      splitters.forEach(e => {
        // tslint:disable-next-line:no-unused-expression
        e &&
          e.addEventListener('mouseup', () => {
            this.toggleChartOverlayHelper(false);
          });
        // tslint:disable-next-line:no-unused-expression
        e &&
          e.addEventListener('mousedown', () => {
            this.toggleChartOverlayHelper(true);
          });
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

  async start() {
    if (this.authStore.isAuth) {
      this.referenceStore.fetchReferenceData();

      await Promise.all([
        this.authStore.fetchUserInfo(),
        this.balanceListStore.fetchAll()
      ]);

      if (this.authStore.noKycAndFunds) {
        this.props.history.push(paths.kycAndFundsCheck);
        return false;
      } else {
        this.props.rootStore.start();
      }
    } else {
      this.authStore.signIn();
    }
    return true;
  }

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
        {this.props.rootStore.sessionStore.sessionNotificationsBlockShown && (
          <SessionNotificationComponent />
        )}
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
