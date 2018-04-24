import {rem} from 'polished';
import {Side} from '../../models';
import styled, {colors, dims, fonts, padding} from '../styled';
import {Table} from '../Table';

const colorBySide = (side: Side) =>
  side === Side.Buy ? colors.buy : colors.sell;

export const StyledWrapper = styled.div`
  height: 100%;
`;

export const StyledBar = styled.div`
  color: ${colors.white};
  font-size: ${rem(14)};
  font-weight: normal;
  text-align: left;
  margin: ${rem(12)} 0;
  display: flex;
  align-items: center;
`;

export const StyledGrouping = styled.div`
  display: flex;
  align-items: center;
  min-height: 24px;

  button {
    background: rgb(39, 39, 39);
    border: none;
    border-radius: 4px;
    color: ${colors.white};
    font-size: ${rem(fonts.small)};
    font-weight: normal;
    opacity: 0.88;
    cursor: pointer;
    outline: none;
    padding: 0;
    height: 24px;
    width: 24px;

    &:first-child {
      margin-left: ${rem(17)};
    }

    &:last-child {
      margin-right: 0;
    }
  }

  div {
    min-width: ${rem(55)};
    margin: 0 ${rem(12)};
    display: inline-block;
    text-align: center;
  }
`;

export const StyledPriceList = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  div.price-list-container {
    display: flex;
    align-items: center;
    div.price-container {
      display: flex;
      flex-direction: column;
      width: ${rem(75)};
      span {
        font-size: ${rem(14)};
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.14;
        letter-spacing: normal;
        text-align: center;
        color: rgba(234, 237, 239, 0.4);
      }
      div {
        height: ${rem(24)};
        font-size: ${rem(16)};
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: center;
        color: #ffffff;
      }
    }
    div.price-container:last-child {
      width: ${rem(120)};
    }
  }
`;

export const StyledSwitch = styled.div`
  color: ${colors.white};
  display: flex;
  align-items: center;

  label {
    cursor: pointer;
    position: relative;

    &:after {
      content: '';
      width: 0;
      height: 0;
      border-top: 4px solid ${colors.lightGrey};
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
  margin-left: -1rem;
  width: calc(100% + 2rem);
  th {
    padding: 0;
    text-align: left;
    width: 33%;
  }
  th:first-child {
    padding-left: 1rem !important;
  }
  th:last-child {
    padding-right: 1rem !important;
    text-align: right;
  }
`;

export const Levels = Table.extend`
  margin-bottom: 0;
  td:first-child {
    padding-left: 1rem !important;
  }
`;

export const FigureList = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  position: sticky;
  top: 0;
  bottom: 0;
  z-index: 1;
`;

export const Figure = styled.div`
  cursor: ${(p: any) => (p.isAuth ? 'pointer' : 'initial')};
  font-size: ${rem(fonts.normal)};
` as any;

export const FigureValue = styled.div`
  text-align: right;
`;

export const FigureHint = styled.div`
  font-size: ${rem(fonts.small)};
  font-weight: normal;
  text-align: right;
  opacity: 0.4;
`;

export const LastPriceValue = FigureValue.extend`
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(fonts.extraLarge)};
  font-weight: bold;
`;

export const MidPrice = Figure.extend`
  margin-left: auto;
`;

export const Spread = Figure.extend`
  cursor: initial;
  margin-left: 30px;
`;

export const MidOverlay = styled.div`
  background: ${colors.darkGraphite};
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

export const MidOverlayBackground = MidOverlay.extend`
  background: ${colors.lightGraphite};
  z-index: -2;
`;

export const StyledOrderRow = styled.tr`
  border-bottom: solid 1px rgba(0, 0, 0, 0.08);

  & > td {
    text-align: left;
    width: 33%;
  }

  &:hover {
    background-color: ${colors.darkGraphite};
  }
` as any;

export const StyledPrice = styled.td`
  color: ${(p: any) => colorBySide(p.side)}!important;
  cursor: ${(p: any) => (p.isAuth ? 'pointer' : 'initial')};
  text-align: left;
` as any;

export const StyledVolume = styled.td`
  color: ${(p: any) => colorBySide(p.side)};
  cursor: ${(p: any) => (p.isAuth ? 'pointer' : 'initial')};
  text-align: left;
  position: relative;
  min-width: 80px !important;
  width: 33%;
` as any;

export const StyledVolumeOverlay = styled.div.attrs({
  style: ({side, volume}: any) => ({
    background: colorBySide(side),
    width: volume + '%'
  })
})`
  border-radius: 2px;
  opacity: 0.16;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
` as any;

export const StyledValue = styled.td`
  text-align: right !important;
`;

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
