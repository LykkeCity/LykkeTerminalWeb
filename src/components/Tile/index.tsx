import {connect} from '../connect';
import ChartMobileTile from './ChartMobileTile';
import ChartTabbedTile from './ChartTabbedTile';
import TabbedTile from './TabbedTile';
import Tile from './Tile';

const ConnectedTile = connect(
  ({authStore: {isAuth}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    readOnlyMode
  }),
  Tile
);

const ConnectedTabbedTile = connect(
  ({authStore: {isAuth}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    readOnlyMode
  }),
  TabbedTile
);

const ConnectedChartTabbedTile = connect(
  ({authStore: {isAuth}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    readOnlyMode
  }),
  ChartTabbedTile
);

const ConnectedChartMobileTile = connect(
  ({authStore: {isAuth}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    readOnlyMode
  }),
  ChartMobileTile
);

export {ConnectedTile as Tile};
export {ConnectedChartTabbedTile as ChartTabbedTile};
export {ConnectedChartMobileTile as ChartMobileTile};
export {ConnectedTabbedTile as TabbedTile};
export {default as TileMenu} from './TileMenu';
