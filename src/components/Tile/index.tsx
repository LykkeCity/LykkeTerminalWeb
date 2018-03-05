import {connect} from '../connect';
import TabbedTile from './TabbedTile';
import Tile from './Tile';

export interface TileProps {
  isAuth: boolean;
  title?: string;
  tabs?: string[];
  authorize?: boolean;
  additionalControls?: any[];
}

const ConnectedTile = connect(
  ({authStore: {isAuth}}) => ({
    isAuth
  }),
  Tile
);

const ConnectedTabbedTile = connect(
  ({authStore: {isAuth}}) => ({
    isAuth
  }),
  TabbedTile
);

export {ConnectedTile as Tile};
export {ConnectedTabbedTile as TabbedTile};
export {default as TileContent} from './TileContent';
export {default as TileTabItem} from './TileTabItem';
export {default as TileMenu} from './TileMenu';
