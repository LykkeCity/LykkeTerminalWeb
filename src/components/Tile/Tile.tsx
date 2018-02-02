import {rem} from 'polished';
import * as React from 'react';
import styled from '../styled';
import Unauthorized from '../Unauthorized/Unauthorized';
import {TileContent, TileProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

const TileWrapper = styled.div`
  /* TODO: find a better way for overflowing content */
  overflow: auto;
`;

const TileHeader = styled(Flex)`
  position: absolute;
  width: 100%;
  background: #292929;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-left: none;
  border-top: none;
  z-index: 1;
`;

const TileTitle = styled(Box)`
  background: #333;
  border-left: none;
  font-size: ${rem(16)};
  font-weight: 600;
  border-right: solid 1px rgba(0, 0, 0, 0.2);
  border-bottom: solid 1px #333;
  padding: ${rem(10)} ${rem(15)};
  margin-bottom: -1px;
`;

const Tile: React.SFC<TileProps> = ({
  title = '',
  children,
  tabs,
  authorize = false,
  isAuth,
  additionalControls,
  additionalControlStore
}) => (
  <TileWrapper>
    <TileHeader justify="space-between">
      <TileTitle>{title} </TileTitle>
    </TileHeader>
    <TileContent
      additionalControls={additionalControls}
      additionalControlStore={additionalControlStore}
      isAuth={isAuth}
      tabs={tabs}
    >
      {authorize ? (
        isAuth ? (
          children
        ) : Array.isArray(children) ? (
          children.map((el: any, index: number) => <Unauthorized key={index} />)
        ) : (
          <Unauthorized />
        )
      ) : (
        children
      )}
    </TileContent>
  </TileWrapper>
);

export default Tile;
