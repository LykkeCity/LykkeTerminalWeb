import {rem} from 'polished';
import * as React from 'react';
import styled from '../styled';
import Unauthorized from '../Unauthorized/Unauthorized';
import {TileContent, TileProps} from './index';
// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export const TileWrapper = styled.div`
  overflow: auto;
`;

export const TileHeader = styled(Flex)`
  position: absolute;
  width: 100%;
  background: #292929;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-left: none;
  border-top: none;
  z-index: 1;
`;

export const TileTitle = styled(Box)`
  color: #f5f6f7;
  background: #333;
  border-left: none;
  font-size: ${rem(16)};
  line-height: 1.5;
  border-right: solid 1px rgba(0, 0, 0, 0.2);
  border-bottom: solid 1px #333;
  padding: ${rem(8)} ${rem(20)};
  margin-bottom: -1px;
  margin-right: ${rem(5)};
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
