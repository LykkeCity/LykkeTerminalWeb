import {fontFace, normalize, transitions} from 'polished';
import * as React from 'react';
import {Mosaic, MosaicDirection} from 'react-mosaic-component';
import {BalanceList} from './components/BalanceList/index';
import {Chart} from './components/Chart/index';
import {Header} from './components/Header/index';
import {OrderBook} from './components/OrderBook/index';
import {OrderList} from './components/OrderList/index';
import styled, {injectGlobal} from './components/styled';
import {Tile} from './components/Tile/index';
import {TradeList} from './components/TradeList/index';
import {Watchlist} from './components/Watchlist/index';
import './index.css';

const addFont = (name: string) => (f: any) =>
  fontFace({
    fileFormats: ['woff', 'eot', 'ttf'],
    fontFamily: name,
    fontFilePath: `${process.env.PUBLIC_URL}/fonts/${f.name}`,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: f.weight,
    localFonts: [''],
    unicodeRange: ''
  });

const addBaseFont: any = addFont('Proxima Nova');
const addIconFont: any = addFont('icomoon');

const allFonts = [
  {weight: 200, name: 'ProximaNovaThin'},
  {weight: 300, name: 'ProximaNova-Light'},
  {weight: 400, name: 'ProximaNovaRegular'},
  {weight: 600, name: 'ProximaNova-Semibold'},
  {weight: 700, name: 'ProximaNovaBold'}
];
const iconFonts = [{weight: 'normal', name: 'icomoon'}];

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  ${allFonts.map(addBaseFont)};
  ${iconFonts.map(addIconFont)}
  ${normalize() as any};
  * {
    border-collapse: collapse;
  }
  :root {
    height: auto;
    min-height: 100%;
    font: 600 14px "Proxima Nova";
    color: #f5f6f7;
    font-size-adjust: none;
    line-height: normal;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
    ${transitions('all 0.8s ease') as any};
  }
  li {
    list-style: none;
  }
`;

const Shell = styled.div`
  background: rgba(0, 0, 0, 0.2);
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
`;

const ELEMENT_MAP: {[viewId: string]: JSX.Element} = {
  acc: (
    <Tile title="Account">
      <BalanceList />
    </Tile>
  ),
  c: (
    <Tile title="Chart">
      <Chart />
    </Tile>
  ),
  e: (
    <Tile title="Executions">
      <TradeList />
    </Tile>
  ),
  ob: (
    <Tile title="Order book">
      <OrderBook />
    </Tile>
  ),
  ord: (
    <Tile title="Orders">
      <OrderList />
    </Tile>
  ),
  wl: (
    <Tile title="Watchlist">
      <Watchlist />
    </Tile>
  )
};

class App extends React.Component {
  render() {
    return (
      <Shell>
        <Header />
        <Mosaic
          // <MosaicWindow title={id} path={path}>
          // </MosaicWindow>
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
                second: 'e'
              },
              splitPercentage: 80
            },
            splitPercentage: 20
          }}
        />
      </Shell>
    );
  }
}

export default App;
