import * as React from 'react';
import {TileContent, TileHeader, TileTitle} from './styles';

export interface TileProps {
  title: string;
  className?: string;
}

const Tile: React.SFC<TileProps> = ({title = '', className, children}) => (
  <React.Fragment>
    <TileHeader className={className}>
      <TileTitle>{title} </TileTitle>
    </TileHeader>
    <TileContent className={className}>{children}</TileContent>
  </React.Fragment>
);

export default Tile;
