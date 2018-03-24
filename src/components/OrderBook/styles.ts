import {rem} from 'polished';
import {Side} from '../../models';
import styled, {colors, dims, fonts, padding} from '../styled';
import {Table} from '../Table';

const colorBySide = (side: Side) =>
  side === Side.Sell ? '#d070ff' : '#ffae2c';

const marginBySide = (side: Side) =>
  side === Side.Sell ? 'marginLeft' : 'marginRight';

export const StyledWrapper = styled.div`
  height: 100%;
`;

export const StyledBar = styled.div`
  display: flex;
  align-items: center;
  font-size: ${rem(14)};
  font-weight: normal;
  text-align: left;
  color: rgb(245, 246, 247);
  margin: ${rem(12)} 0;
`;

export const StyledGrouping = styled.div`
  display: flex;
  align-items: center;
  min-height: 24px;
  padding-left: 2px;

  button {
    background: none;
    border: none;
    color: rgb(216, 216, 216);
    opacity: 0.4;
    font-size: 1.4rem;
    font-weight: bold;
    cursor: pointer;
    outline: none;
    padding: 0;

    &:first-child {
      margin-left: ${rem(17)};
    }

    &:last-child {
      margin-right: 0;
    }
  }

  strong {
    font-weight: 600;
    min-width: ${rem(52)};
    display: inline-block;
    text-align: center;
  }
`;

export const StyledSwitch = styled.div`
  color: #ffffff;
  display: flex;
  align-items: center;

  label {
    cursor: pointer;
    position: relative;

    &:after {
      content: '';
      width: 0;
      height: 0;
      border-top: 4px solid rgba(245, 246, 247, 0.4);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      position: relative;
      top: 10px;
      left: 10px;
    }
  }
`;

export const StyledHeader = Table.extend`
  margin: ${rem(dims.padding[1])} 0 ${rem(dims.padding[0])};
`;

export const StyledHeaderRow = styled.tr``;

export const StyledHeaderCell = styled.th`
  text-align: ${(p: any) => p.align} !important;
  padding: 0 !important;
  width: 33%;
` as any;

export const StyledOrders = Table.extend`
  td:first-child {
    padding-left: 1rem !important;
  }
  td:last-child {
    padding-right: 1rem !important;
  }
`;

export const StyledSellOrders = styled.tbody``;

export const StyledBuyOrders = styled.tbody``;

export const StyledMidPrice = styled.td`
  min-height: 24px;
  color: ${colors.white};
  font-family: 'Akrobat';
  padding: 1rem 0 !important;
  position: relative;

  &:hover {
    cursor: pointer;
  }
` as any;

export const MidOverlay = styled.div`
  background: ${colors.darkGraphite};
  position: absolute;
  top: 0;
  left: -1rem;
  right: -1rem;
  bottom: 0;
  z-index: 999;
`;

export const MidFigures = styled.div`
  display: flex;
  justify-content: space-between;

  strong {
    font-size: ${rem(fonts.extraLarge)};
    font-weight: bold;
  }

  small {
    text-align: right;
    font-size: ${rem(fonts.large)};
    span {
      opacity: 0.4;
      font-size: ${rem(fonts.normal)};
    }
  }
`;

export const StyledOrderRow = styled.tr`
  border-bottom: solid 1px rgba(0, 0, 0, 0.08);

  & > td {
    text-align: left;
    width: 33%;
  }

  &:hover {
    background-color: ${colors.darkGraphite};
    cursor: pointer;
  }
`;

export const StyledPrice = styled.td`
  text-align: left;
`;

export const StyledVolume = styled.td`
  color: ${(p: any) => colorBySide(p.side)};
  text-align: left;
  position: relative;
  min-width: 80px !important;
  width: 33%;
` as any;

export const StyledVolumeOverlay = styled.div.attrs({
  style: (props: any) => ({
    background: colorBySide(props.side),
    width: `${props.volume}%`,
    left: '0%'
  })
})`
  position: absolute;
  top: 0;
  height: 100%;
  opacity: 0.15;
  border-radius: 2px;
` as any;

export const StyledValue = styled.td`
  text-align: right !important;
`;

export const StyledCloseOrders = styled.div.attrs({
  style: (props: any) => ({
    [marginBySide(props.side)]: '5px'
  })
})`
  cursor: pointer;
` as any;

export const MyOrdersPopover = styled.div`
  position: absolute;
  top: ${(p: any) => p.position.top}px;
  right: 100%;
  z-index: 999;
  min-width: ${rem(180)};
  background-color: rgb(60, 60, 60);
  border: solid 1px ${colors.darkGraphite};
  box-shadow: 0 10px 10px 0 ${colors.darkGraphite};
  padding: ${padding(dims.padding[1])};
  font-size: ${rem(fonts.normal)};
  text-align: center;
  visibility: ${(p: any) => (p.show ? 'visible' : 'hidden')};

  &:after {
    content: '';
    position: absolute;
    top: 45%;
    right: -10px;
    width: 0;
    height: 0;
    border-left: 10px solid rgb(60, 60, 60);
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
` as any;

export const MyOrdersCount = styled.h4`
  color: ${colors.white};
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(fonts.extraLarge)};
  font-weight: bold;
  line-height: 0.67;
  text-align: center;
  margin: 0;
  padding: 0;
  margin-bottom: ${rem(20)};
`;

export const MyOrdersVolume = styled.div`
  color: ${colors.white};
  text-align: center;
  margin-bottom: ${rem(20)};

  small {
    opacity: 0.4;
  }
`;

export const MyOrdersCancelButton = styled.button`
  background: transparent;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: ${colors.white};
  font-size: ${rem(fonts.normal)};
  padding: ${padding(...dims.padding)};
  cursor: pointer;
  outline: none;
`;

export const MyOrdersIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 2px;
  background: ${(p: any) => colorBySide(p.side)};
` as any;
