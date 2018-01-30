import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import additionalActions from '../../constants/additionalActions';
import paths from '../../constants/paths';
import keys from '../../constants/storageKeys';
import tabs from '../../constants/tabs';
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
import {Tile} from '../Tile';
import {TradeList} from '../TradeList';
import {WalletBalanceList} from '../WalletBalanceList';
import {TerminalProps} from './index';

const Shell = styled.div`
  background: rgba(0, 0, 0, 0.2);
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
`;

const layoutStorage = StorageUtils(keys.layout);
const ELEMENT_MAP = (rootStore: any): {[viewId: string]: JSX.Element} => ({
  acc: (
    <Tile title="Account" tabs={tabs.walletBalance} authorize={true}>
      <WalletBalanceList />
      <BalanceList />
    </Tile>
  ),
  c: (
    <Tile title="Chart">
      <Chart />
    </Tile>
  ),
  e: (
    <Tile title="Executions" tabs={tabs.executions} authorize={true}>
      <div>Market trades</div>
      <TradeList />
    </Tile>
  ),
  ob: (
    <Tile title="Order book">
      <OrderBook />
    </Tile>
  ),
  ord: (
    <Tile
      title="Orders"
      authorize={true}
      additionalControls={additionalActions.orders.map(addAction => {
        addAction.action =
          rootStore[addAction.actionParams.store][
            addAction.actionParams.method
          ];
        return addAction;
      })}
    >
      <OrderList />
    </Tile>
  ),
  wl: (
    <Tile title="Order" authorize={true}>
      <Order />
    </Tile>
  )
});

class Terminal extends React.Component<TerminalProps, {}> {
  private unlisten: any;
  private initialValue: any = {
    direction: 'row' as MosaicDirection,
    first: {
      direction: 'column' as MosaicDirection,
      first: 'wl',
      second: 'acc'
    },
    second: {
      direction: 'row' as MosaicDirection,
      first: {
        direction: 'column' as MosaicDirection,
        first: 'c',
        second: 'ord',
        splitPercentage: 70
      },
      second: {
        direction: 'column' as MosaicDirection,
        first: 'ob',
        second: 'e',
        splitPercentage: 70
      },
      splitPercentage: 78
    },
    splitPercentage: 22
  };

  constructor(props: TerminalProps) {
    super(props);
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
      if (location.pathname === paths.singin) {
        this.props.rootStore.reset();
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleChange = (args: any) => {
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
          renderTile={(id, path) => ELEMENT_MAP(this.props.rootStore)[id]}
          onChange={this.handleChange}
          resize={{minimumPaneSizePercentage: 10}}
          initialValue={this.initialValue}
        />
      </Shell>
    );
  }
}

export default Terminal;
