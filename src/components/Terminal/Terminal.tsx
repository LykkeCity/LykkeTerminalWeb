import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import keys from '../../constants/storageKeys';
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

const Shell = styled.div`
  background: ${colors.darkGraphite};
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
`;

const layoutStorage = StorageUtils(keys.layout);
const MIN_PANE_SIZE_PERCENTAGE = 25;
const ELEMENT_MAP: {[viewId: string]: JSX.Element} = {
  acc: (
    <Tile title="Account">
      <Account />
    </Tile>
  ),
  c: (
    <Tile title="Chart">
      <Chart />
    </Tile>
  ),
  e: (
    <Tile title="Trade log">
      <TradeLog />
    </Tile>
  ),
  ob: (
    <Tile title="Order book">
      <OrderBook />
    </Tile>
  ),
  ord: (
    <TabbedTile tabs={['Orders', 'Trades']}>
      <Orders />
      <Trades />
    </TabbedTile>
  ),
  wl: (
    <Tile title="Order" authorize={true}>
      <Order />
    </Tile>
  )
};

class Terminal extends React.Component<TerminalProps, {}> {
  private initialValue: any = {
    direction: 'row' as MosaicDirection,
    first: {
      direction: 'column' as MosaicDirection,
      first: 'wl',
      second: 'acc',
      splitPercentage: 60
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
    this.handlerMouseUpTransparentDiv();
  }

  handlerMouseUpTransparentDiv() {
    const mosaicSplit = document.getElementsByClassName(
      'mosaic-split -column'
    )[0];
    if (mosaicSplit) {
      mosaicSplit.addEventListener('mouseup', () => {
        this.removeTransparentDivAfterResize();
      });
    }
  }

  removeTransparentDivAfterResize() {
    document.getElementById('transparentDiv')!.style.display = 'none';
  }

  handleRenderTile = (id: string) => ELEMENT_MAP[id];

  handleChange = (args: any) => {
    if (
      args.second.first.splitPercentage <= MIN_PANE_SIZE_PERCENTAGE ||
      args.second.first.splitPercentage >= 100 - MIN_PANE_SIZE_PERCENTAGE
    ) {
      this.removeTransparentDivAfterResize();
    } else {
      document.getElementById('transparentDiv')!.style.display = 'block';
    }
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
          initialValue={this.initialValue}
        />
      </Shell>
    );
  }
}

export default Terminal;
