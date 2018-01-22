import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import tabs from '../../constants/tabs';
import {BalanceList} from '../BalanceList';
import {Chart} from '../Chart/index';
import {Header} from '../Header';
import {Order} from '../Order';
import OrderBook from '../OrderBook';
import {OrderList} from '../OrderList';
import styled from '../styled';
import {Tile} from '../Tile/index';
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
  constructor(props: TerminalProps) {
    super(props);
  }

  componentDidMount() {
    this.props.rootStore.start();
  }

  render() {
    return (
      <Shell>
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
