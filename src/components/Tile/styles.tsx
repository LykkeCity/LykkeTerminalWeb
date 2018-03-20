import {rem} from 'polished';
import styled, {colors, dims, fonts, padding} from '../styled';

const lightGraphite = (p: any) =>
  p.selected ? colors.lightGraphite : 'transparent';

const darkGraphite = (p: any) =>
  p.selected ? colors.darkGraphite : 'transparent';

export const TileHeader = styled.div`
  display: flex;
  align-items: center;
  border: none;
  border-bottom: 1px solid ${colors.darkGraphite};
  font-size: ${rem(fonts.large)};
  position: relative;
  z-index: 0;
  height: ${rem(dims.tileHeaderHeight)} !important;
  width: 100% !important;
  &:before {
    content: '';
    background-color: ${colors.darkGraphite};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    z-index: -1;
  }
`;

export const TileTitle = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.lightGraphite};
  color: ${colors.white};
  border: none;
  border-right: 1px solid ${colors.darkGraphite};
  border-bottom: solid 1px ${colors.lightGraphite};
  padding: ${padding(...dims.padding)};
  margin-bottom: -1px;
  height: calc(100% + 1px);
`;

export const TileTab = TileTitle.extend`
  background: ${p => lightGraphite(p)};
  border: solid 1px transparent;
  border-right-color: ${p => darkGraphite(p)};
  border-left-color: ${p => darkGraphite(p)};
  border-bottom-color: ${p => lightGraphite(p)};
  cursor: pointer;

  &:first-child {
    border-left: none !important;
  }
` as any;

export const TileContent = styled.div`
  font-size: ${rem(fonts.normal)};
  padding: ${padding(...dims.padding)};
  height: calc(100% - ${rem(dims.tileHeaderHeight)}) !important;
  overflow: hidden;
`;

export const TileToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: ${padding(8, 0)};
  width: 100%;
`;

export const Pills = styled.div`
  display: flex;
  align-items: center;
  width: 50%;

  &:first-child {
    padding-right: 4px;
  }

  &:not(:first-child):last-child {
    padding-left: 4px;
  }
`;

export const Pill = styled.span`
  &.clickable {
    width: 100%;
    cursor: pointer;
    text-align: center;
    border-radius: ${rem(4)};
    padding: ${rem(7)} ${rem(10)};
    border: solid 1px rgba(140, 148, 160, 0.4);
  }

  &.active {
    border-color: #0388ef;
    box-shadow: inset 0 0 0 1px #0388ef;
  }
`;
