import {connect} from '../connect';
import Tile from './Tile';

export interface TileProps {
  isAuth: boolean;
  title?: string;
  tabs?: string[];
  hasAuthorizing?: boolean;
}

const connectedTile = connect(
  ({authStore: {isAuth}}) => ({
    isAuth
  }),
  Tile
);

export {connectedTile as Tile};
export {default as TileContent} from './TileContent';
export {default as TileTabItem} from './TileTabItem';
export {default as TileMenu} from './TileMenu';
