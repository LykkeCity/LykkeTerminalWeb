import {Header, MenuItem} from '@lykkex/react-components';
import * as React from 'react';
import {Mosaic, MosaicDirection, MosaicNode} from 'react-mosaic-component';
import {RouteComponentProps} from 'react-router-dom';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {
  API_KEYS_ROUTE,
  FEES_AND_LIMITS_ROUTE,
  FUNDS_ROUTE,
  LYKKE_STREAMS_ROUTE,
  SETTINGS_ROUTE,
  TRADE_ROUTE
} from '../../constants/lykkeRoutes';
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
import ApplicationLink from '../ApplicationLink/ApplicationLink';
import Backdrop from '../Backdrop/Backdrop';
import {Footer} from '../Footer';
import {Header as SubHeader} from '../Header';
import Modal from '../Modal/Modal';
import {NotificationList} from '../Notification';
import {Order} from '../Order';
import OrderBook from '../OrderBook';
import {Orders} from '../OrderList';
import {SessionNotificationComponent} from '../Session';
import {ChartTabbedTile, TabbedTile, Tile} from '../Tile';
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
  TradingWalletWidget
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
  )
};

const headerLinkOptions = [
  {
    title: MenuItem.Trade,
    url: TRADE_ROUTE
  },
  {
    title: MenuItem.Funds,
    url: FUNDS_ROUTE
  },
  {
    title: MenuItem.Settings,
    url: SETTINGS_ROUTE
  }
];

const secondMenuLinkOptions = [
  {
    title: MenuItem.LykkeStreams,
    url: LYKKE_STREAMS_ROUTE
  },
  {
    title: MenuItem.ApiKeys,
    url: API_KEYS_ROUTE
  },
  {
    title: MenuItem.FeesAndLimits,
    url: FEES_AND_LIMITS_ROUTE
  }
];

const renderLink = (classes: string, title: JSX.Element, url: string) => {
  return (
    <ApplicationLink classes={classes} title={title} url={url} key={url} />
  );
};

class Terminal extends React.Component<
  TerminalProps & RouteComponentProps<TerminalProps>,
  {}
> {
  state = {
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

  private authStore: AuthStore = this.props.rootStore.authStore;
  private balanceListStore: BalanceListStore = this.props.rootStore
    .balanceListStore;
  private referenceStore: ReferenceStore = this.props.rootStore.referenceStore;
  private uiStore: UiStore = this.props.rootStore.uiStore;
  private isMosaicChanged: boolean = false;

  componentDidMount() {
    this.setUserInstrument();
    this.updateRouteBySelectedInstrument();

    this.start().then(resp => {
      if (!resp) {
        return;
      }
      this.updateLayoutFromLocalStorage();
      this.bindChartOverlayHandler();

      if (this.authStore.isAuth) {
        AnalyticsService.handleIdentify(
          AnalyticsEvents.UserIdentifyTraits(this.authStore.userInfo)
        );
      }

      AnalyticsService.track(AnalyticsEvents.LoadTerminal);
    });
  }

  setUserInstrument() {
    if (this.props.match.params.instrument) {
      this.props.rootStore.uiStore.userSelectedInstrument = this.props.match.params.instrument;
    }
  }

  updateRouteBySelectedInstrument() {
    const selectedInstrument =
      this.props.match.params.instrument || UiStore.DEFAULT_INSTRUMENT;
    this.props.history.push(`/trade/${selectedInstrument}`);
  }

  updateLayoutFromLocalStorage() {
    const layout = layoutStorage.get();
    if (!layout) {
      return;
    }

    const layoutFromLocalstorage = JSON.parse(layout);
    const currentStateHashCode = this.getStateHashCode(this.state.initialValue);
    const savedStateHashCode = this.getStateHashCode(layoutFromLocalstorage);
    if (currentStateHashCode !== savedStateHashCode) {
      layoutStorage.set('');
      return;
    }

    this.setState({
      initialValue: Object.assign(this.state.initialValue, JSON.parse(layout))
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

      AnalyticsService.track(AnalyticsEvents.SectionSplitterMoved);
    }
  };

  onLogout() {
    this.authStore.signOut();
    AnalyticsService.track(AnalyticsEvents.LogOut);
  }

  async start() {
    await this.referenceStore.fetchReferenceData();

    if (this.authStore.isAuth) {
      await Promise.all([
        this.authStore.fetchUserInfo(),
        this.balanceListStore.fetchAll()
      ]);

      this.props.rootStore.start();
    } else {
      const defaultInstrument = this.referenceStore.getInstrumentById(
        UiStore.DEFAULT_INSTRUMENT
      );
      this.props.rootStore.startPublicMode(defaultInstrument);
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
          activeMenuItem={MenuItem.Trade}
          headerLinkOptions={headerLinkOptions}
          renderLink={renderLink}
          getStartedUrl={paths.auth}
          isAuth={this.authStore.isAuth}
          secondaryMenuLinkOptions={secondMenuLinkOptions}
          isSecondaryMenuShown={true}
          isBeta={true}
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
          <Mosaic
            renderTile={this.handleRenderTile}
            onChange={this.handleChange}
            resize={{minimumPaneSizePercentage: MIN_PANE_SIZE_PERCENTAGE}}
            initialValue={this.state.initialValue}
          />
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
