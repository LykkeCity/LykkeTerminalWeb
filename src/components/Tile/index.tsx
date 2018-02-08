import {connect} from '../connect';
import TabbedTile from './TabbedTile';
import Tile from './Tile';

export interface TileProps {
  isAuth: boolean;
  title?: string;
  tabs?: string[];
  authorize?: boolean;
  additionalControls?: any[];
  additionalControlStore?: any;
}

const ConnectedTile = connect(
  ({additionalControlStore, authStore: {isAuth}}) => ({
    additionalControlStore,
    isAuth
  }),
  Tile
);

const ConnectedTabbedTile = connect(
  ({additionalControlStore, authStore: {isAuth}}) => ({
    additionalControlStore,
    isAuth
  }),
  TabbedTile
);

export {ConnectedTile as Tile};
export {ConnectedTabbedTile as TabbedTile};
export {default as TileContent} from './TileContent';
export {default as TileTabItem} from './TileTabItem';
export {
  default as TileAdditionalControlItem
} from './TileAdditionalControlItem';
export {default as TileMenu} from './TileMenu';
