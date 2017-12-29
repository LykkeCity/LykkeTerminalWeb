import {lighten, rem} from 'polished';
import * as React from 'react';
import {Icon} from '../Icon/index';
import styled, {css} from '../styled';
import {TileContent} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

interface TileProps {
  title?: string;
  tabs: string[];
}

const iconCss = css`
  i {
    cursor: pointer;
    color: #d8d8d8;
    &:hover {
      color: ${lighten(0.2)('#d8d8d8')};
    }
  }
`;

const TileWrapper = styled.div`
  /* TODO: find a better way for overflowing content */
  overflow: auto;
  > div:first-child {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-left: none;
  }
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

const TileMenu = styled(Box)`
  background: transparent;
  border-right: none;
  border-left: solid 1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: ${rem(5)} 0;
  padding: ${rem(5)} ${rem(15)};
  ${iconCss};
`;

const Tile: React.SFC<TileProps> = ({title = '', children, tabs}) => (
  <TileWrapper>
    <Flex justify="space-between">
      <TileTitle>{title} </TileTitle>
      <TileMenu>
        <Icon name="menu" />
      </TileMenu>
    </Flex>
    <TileContent tabs={tabs}>{children}</TileContent>
  </TileWrapper>
);

export default Tile;
