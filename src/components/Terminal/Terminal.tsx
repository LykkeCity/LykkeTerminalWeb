import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import paths from '../../constants/paths';
import tabs from '../../constants/tabs';
import ModalModel from '../../models/modalModel';
import Backdrop from '../Backdrop/Backdrop';
import {BalanceList} from '../BalanceList';
import {Chart} from '../Chart/index';
import {Header} from '../Header';
import ConfirmModal from '../Modal/ConfirmModal';
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

const ELEMENT_MAP: {[viewId: string]: JSX.Element} = {
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
    <Tile title="Orders" authorize={true}>
      <OrderList />
    </Tile>
  ),
  wl: (
    <Tile title="Order" authorize={true}>
      <Order />
    </Tile>
  )
};

class Terminal extends React.Component<TerminalProps, {}> {
  private unlisten: any;

  constructor(props: TerminalProps) {
    super(props);
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

  render() {
    return (
      <Shell>
        {this.props.rootStore.modalStore.isModals ? (
          <div>
            <Backdrop />
            {this.props.rootStore.modalStore.modals.map(
              (modal: ModalModel, index: number) => {
                return <ConfirmModal key={index} modal={modal} />;
              }
            )}
          </div>
        ) : null}
        <Header history={this.props.history} />
        <Mosaic
          // tslint:disable-next-line:jsx-no-lambda
          renderTile={(id, path) => ELEMENT_MAP[id]}
          resize={{minimumPaneSizePercentage: 10}}
          initialValue={{
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
          }}
        />
      </Shell>
    );
  }
}

export default Terminal;
