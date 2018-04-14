import {connect} from '../connect';
import TabbedTile from './TabbedTile';
import Tile from './Tile';

const ConnectedTile = connect(
  ({authStore: {isAuth}, uiStore: {viewMode}}) => ({
    isAuth,
    viewMode
  }),
  Tile
);

const ConnectedTabbedTile = connect(
  ({authStore: {isAuth}, uiStore: {viewMode}}) => ({
    isAuth,
    viewMode
  }),
  TabbedTile
);

export {ConnectedTile as Tile};
export {ConnectedTabbedTile as TabbedTile};
export {default as TileMenu} from './TileMenu';
// export {default as TileToolbar} from './TileToolbar';
