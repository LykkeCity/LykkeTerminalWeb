import {Header} from '@lykkex/react-components';
import * as React from 'react';
import {Mosaic, MosaicDirection, MosaicNode} from 'react-mosaic-component';
import MediaQuery from 'react-responsive';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import media from '../../constants/media';
import paths from '../../constants/paths';
import {keys} from '../../models';
import Widgets from '../../models/mosaicWidgets';
import {AnalyticsService} from '../../services/analyticsService';
import {
  AuthStore,
  BalanceListStore,
  ReferenceStore,
  UiStore
} from '../../stores';
import {getHashCode} from '../../utils/hashcode';
import {StorageUtils} from '../../utils/index';
import Backdrop from '../Backdrop/Backdrop';
import {Footer} from '../Footer';
import {Header as SubHeader} from '../Header';
import Modal from '../Modal/Modal';
import {NotificationList} from '../Notification';
import {Order} from '../Order';
import OrderBook from '../OrderBook';
import {Orders} from '../OrderList';
import {SessionNotificationComponent} from '../Session';
import {ChartTabbedTile, TabbedTile, Tile, TopWidgetTile} from '../Tile';
import {TradeLog, Trades} from '../TradeList';
import {Wallet} from '../TradingWallet';
import {TerminalProps} from './index';
import {Shell, TerminalWrapper} from './styles';

const layoutStorage = StorageUtils(keys.layout);

const MAX_LEFT_PADDING = 20;
const MAX_RIGHT_PADDING = 72.5;
const MIN_PANE_SIZE_PERCENTAGE = 20;

const {
  ChartWidget,
  OrderWidget,
  OrderBookWidget,
  OrderListWidget,
  TradeListWidget,
  TradingWalletWidget,
  MobileTopWidget,
  MobileBottomWidget
} = Widgets;

const ELEMENT_MAP: {[viewId: string]: JSX.Element} = {
  [ChartWidget]: (
    <ChartTabbedTile tabs={['Price chart', 'Depth chart']} authorize={false} />
  ),
  [TradeListWidget]: (
    <Tile title="Trade log" className="bottom-tile">
      <TradeLog />
    </Tile>
  ),
  [OrderBookWidget]: (
    <Tile title="Order book" className="with-padding">
      <OrderBook />
    </Tile>
  ),
  [OrderListWidget]: (
    <TabbedTile tabs={['Orders', 'Trades']} className="bottom-tile">
      <Orders />
      <Trades />
    </TabbedTile>
  ),
  [OrderWidget]: (
    <Tile title="Order" authorize={true}>
      <Order />
    </Tile>
  ),
  [TradingWalletWidget]: (
    <Tile title="Funds" className="bottom-tile">
      <Wallet />
    </Tile>
  ),
  [MobileTopWidget]: (
    <TopWidgetTile
      tabs={['Order', 'Price chart', 'Depth chart', 'Order book']}
    />
  ),
  [MobileBottomWidget]: (
    <TabbedTile tabs={['Trade log', 'Orders', 'Trades', 'Funds']}>
      <TradeLog />
      <Orders />
      <Trades />
      <Wallet />
    </TabbedTile>
  )
};

class Terminal extends React.Component<TerminalProps, {}> {
  desktopState = {
    initialValue: {
      direction: 'row' as MosaicDirection,
      first: {
        direction: 'column' as MosaicDirection,
        first: OrderWidget,
        second: TradingWalletWidget,
        splitPercentage: 75
      },
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

  mobileState = {
    initialValue: {
      direction: 'column' as MosaicDirection,
      first: MobileTopWidget,
      second: MobileBottomWidget,
      splitPercentage: 65
    }
  };

  private authStore: AuthStore = this.props.rootStore.authStore;
  private balanceListStore: BalanceListStore = this.props.rootStore
    .balanceListStore;
  private referenceStore: ReferenceStore = this.props.rootStore.referenceStore;
  private uiStore: UiStore = this.props.rootStore.uiStore;
  private isMosaicChanged: boolean = false;

  handleVisibilityChange = () => {
    this.props.rootStore.uiStore.setPageVisibility(
      document.visibilityState === 'visible'
    );
  };

  componentDidMount() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.props.rootStore.uiStore.setPageVisibility(
      document.visibilityState === 'visible'
    );
    this.start().then(resp => {
      if (!resp) {
        return;
      }
      this.updateLayoutFromLocalStorage();
      this.bindChartOverlayHandler();

      AnalyticsService.handleIdentify(
        this.authStore.userInfo.email,
        AnalyticsEvents.UserIdentifyTraits(this.authStore.userInfo)
      );
    });
  }

  updateLayoutFromLocalStorage() {
    const layout = layoutStorage.get();
    if (!layout) {
      return;
    }

    const layoutFromLocalstorage = JSON.parse(layout);
    const currentStateHashCode = this.getStateHashCode(
      this.desktopState.initialValue
    );
    const savedStateHashCode = this.getStateHashCode(layoutFromLocalstorage);
    if (currentStateHashCode !== savedStateHashCode) {
      layoutStorage.set('');
      return;
    }

    this.setState({
      initialValue: Object.assign(
        this.desktopState.initialValue,
        JSON.parse(layout)
      )
    });
  }

  bindChartOverlayHandler() {
    const firstColSplitter = document.getElementsByClassName(
      'mosaic-split -column'
    )[0];
    const rowSplitters = document.getElementsByClassName('mosaic-split -row');
    const splitters = [...Array.from(rowSplitters), firstColSplitter];
    const mouseUp = (event: MouseEvent) => {
      event.stopPropagation();
      document.body.removeEventListener('mouseup', mouseUp);

      this.toggleChartOverlayHelper(false);
    };

    if (splitters) {
      splitters.forEach(e => {
        // tslint:disable-next-line:no-unused-expression
        e &&
          e.addEventListener('mousedown', () => {
            document.body.addEventListener('mouseup', mouseUp);
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

    if (!this.isMosaicChanged) {
      this.isMosaicChanged = true;
      setTimeout(() => (this.isMosaicChanged = false), 1000);

      AnalyticsService.handleClick(AnalyticsEvents.SectionSplitterMoved);
    }
  };

  onLogout() {
    this.authStore.signOut();
    AnalyticsService.handleClick(AnalyticsEvents.LogOut);
  }

  async start() {
    if (this.authStore.isAuth) {
      await this.referenceStore.fetchReferenceData();

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
    const userInfo = this.uiStore.getUserInfo();
    const userName = userInfo ? userInfo.fullName : undefined;
    const email = userInfo ? userInfo.email : undefined;
    return (
      <Shell>
        <Header
          // tslint:disable-next-line:jsx-no-lambda
          onLogout={() => this.onLogout()}
          userName={userName}
          email={email}
          activeMenuItem="trade"
        />
        <TerminalWrapper>
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
          <SubHeader history={this.props.history} />
          <MediaQuery query={media.desktop}>
            <Mosaic
              renderTile={this.handleRenderTile}
              onChange={this.handleChange}
              resize={{minimumPaneSizePercentage: MIN_PANE_SIZE_PERCENTAGE}}
              initialValue={this.desktopState.initialValue}
            />
          </MediaQuery>
          <MediaQuery query={media.mobile}>
            <Mosaic
              renderTile={this.handleRenderTile}
              onChange={this.handleChange}
              resize={{minimumPaneSizePercentage: MIN_PANE_SIZE_PERCENTAGE}}
              initialValue={this.mobileState.initialValue}
            />
          </MediaQuery>
          <Footer />
        </TerminalWrapper>
      </Shell>
    );
  }

  private getStateHashCode = (state: MosaicNode<string>) =>
    getHashCode(this.getWidgetsArray(state));

  private getWidgetsArray = (
    state: MosaicNode<string>,
    widgetsArray: string[] = []
  ) => {
    const propertyNames = ['first', 'second'];
    propertyNames.forEach(property => {
      const widgetState = state[property];
      if (typeof widgetState === 'string') {
        widgetsArray.push(widgetState);
      } else if (!!widgetState) {
        this.getWidgetsArray(widgetState, widgetsArray);
      }
    });

    return widgetsArray;
  };
}

export default Terminal;
