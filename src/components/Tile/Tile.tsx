import * as React from 'react';
import {TileContent, TileHeader, TileTitle} from './styles';

export interface TileProps {
  title: string;
}

const Tile: React.SFC<TileProps> = ({title = '', children}) => (
  <React.Fragment>
    <TileHeader>
      <TileTitle>{title} </TileTitle>
    </TileHeader>
    <TileContent>{children}</TileContent>
  </React.Fragment>
);

export default Tile;
