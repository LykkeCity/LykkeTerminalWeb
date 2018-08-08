import {rem} from 'polished';
import styled, {dims, fonts, padding} from '../styled';

const getTileBackground = (props: any) =>
  props.selected ? props.theme.colors.tileBackground : 'transparent';

const getTileBorder = (props: any) =>
  props.selected ? props.theme.colors.tileBorder : 'transparent';

export const TileHeader = styled.div`
  display: flex;
  align-items: center;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.tileBorder};
  font-size: ${rem(fonts.normal)};
  position: relative;
  z-index: 0;
  height: ${dims.tileHeaderHeight}px !important;
  width: 100% !important;
  &:before {
    content: '';
    background-color: ${props => props.theme.colors.tileHeaderBackground};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

export const TileTitle = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.tileBackground};
  color: ${props => props.theme.colors.tileTitle};
  border: none;
  border-right: 1px solid ${props => props.theme.colors.tileBorder};
  border-bottom: 0;
  padding: ${padding(...dims.padding)};
  margin-bottom: -1px;
  height: calc(100% + 1px);
`;

export const TileTab = TileTitle.extend`
  background: ${p => getTileBackground(p)};
  border: solid 1px transparent;
  border-right-color: ${p => getTileBorder(p)};
  border-left-color: ${p => getTileBorder(p)};
  cursor: pointer;

  &:first-child {
    border-left: none !important;
  }
` as any;

export const TileContent = styled.div`
  font-size: ${rem(fonts.normal)};
  padding: ${padding(...dims.padding)};
  height: calc(100% - 40px) !important;
  overflow: hidden;

  &.no-padding {
    height: 100% !important;
  }
`;

export const TileToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: ${padding(8, 0)};
  width: 100%;
`;
