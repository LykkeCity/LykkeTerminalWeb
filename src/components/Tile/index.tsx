import {connect} from '../connect';
import ChartTabbedTile from './ChartTabbedTile';
import TabbedTile from './TabbedTile';
import Tile from './Tile';
import TopWidgetTile from './TopWidgetTile';

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

const ConnectedTopWidgetTile = connect(
  ({authStore: {isAuth}, uiStore: {readOnlyMode}}) => ({
    isAuth,
    readOnlyMode
  }),
  TopWidgetTile
);

export {ConnectedTile as Tile};
export {ConnectedChartTabbedTile as ChartTabbedTile};
export {ConnectedTopWidgetTile as TopWidgetTile};
export {ConnectedTabbedTile as TabbedTile};
export {default as TileMenu} from './TileMenu';
