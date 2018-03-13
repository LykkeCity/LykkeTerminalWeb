import {rem} from 'polished';
import {Side} from '../../models';
import styled, {css} from '../styled';

const colorBySide = (side: Side) =>
  side === Side.Sell ? '#d070ff' : '#ffae2c';

const volumeColorBySide = (side: Side) =>
  side === Side.Sell ? '#ab00ff' : '#fb8f01';

const alignBySide = (side: Side) => (side === Side.Sell ? 'right' : 'left');

const marginBySide = (side: Side) =>
  side === Side.Sell ? 'marginLeft' : 'marginRight';

export const StyledWrapper = styled.div`
  height: 100%;
  margin-right: -0.9375rem;
  padding-top: ${rem(55)};
`;

export const StyledHead = styled.thead`
  display: block;
  position: absolute;
  width: 100%;
  left: 0;
  background: #333;
  z-index: 1;
`;

export const StyledRow = styled.tr`
  display: flex;
  justify-content: space-evenly;
`;

export const StyledSellOrders = styled.tbody`
  display: block;
  margin: 34px 0.9375rem 0 0;
`;

export const StyledBuyOrders = styled(StyledSellOrders)`
  margin: 0 0.9375rem 0 0;
`;

export const StyledMidPrice = styled.tbody`
  display: flex;
  justify-content: center;
  margin: 0 0.9375rem 0 0;
  background: rgba(0, 0, 0, 0.2);

  &:hover {
    cursor: pointer;
  }
`;

export const StyledHeader = styled.th.attrs({
  style: (props: any) => ({
    textAlign: props.align
  })
})`
  flex-grow: 1;
` as any;

export const StyledSwitch = styled.div`
  color: #ffffff;
  display: flex;
  align-items: center;
  top: ${rem(18)};
  left: ${rem(8)};
  right: ${rem(8)};
  z-index: 10;
  position: absolute;
`;

export const StyledSwitchItem = styled.div`
  border: solid 1px rgba(140, 148, 160, 0.4);
  border-radius: 4px;
  padding: ${rem(8)} ${rem(18)};
  cursor: pointer;
  ${(p: any) =>
    p.active &&
    css`
      background-color: rgb(3, 136, 239);
      border: solid 1px rgba(0, 0, 0, 0.2);
      margin: -1px 0 -1px;
    `};
  :first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  :last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
` as any;

export const StyledCommonCell = styled.td`
  flex-grow: 1;
`;

export const StyledVolumeCell = StyledCommonCell.extend.attrs({
  style: (props: any) => ({
    color: colorBySide(props.side),
    textAlign: alignBySide(props.side)
  })
})`
  position: relative;
  min-width: 80px !important;
  width: 33%;
` as any;

export const StyledVolumeValue = styled.div.attrs({
  style: (props: any) => ({
    background: volumeColorBySide(props.side)
  })
})`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  height: 100%;
  padding: 0 7px;

  &::before {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
` as any;

export const StyledAskVolume = styled(StyledVolumeValue)`
  right: 5px;
  &::before {
    border-left: 5px solid #fb8f01;
    right: -4px;
  }
`;

export const StyledBidVolume = styled(StyledVolumeValue)`
  &::before {
    border-right: 5px solid #ab00ff;
    left: -4px;
  }
`;

export const StyledCloseOrders = styled.div.attrs({
  style: (props: any) => ({
    [marginBySide(props.side)]: '5px'
  })
})`
  cursor: pointer;
` as any;

export const StyledMidCell = styled(StyledCommonCell)`
  width: 33%;
  text-align: center !important;
`;

export const StyledVolumeOverlay = styled.div.attrs({
  style: (props: any) => ({
    background: colorBySide(props.side),
    width: `${props.volume}%`,
    [alignBySide(props.side)]: '0%'
  })
})`
  position: absolute;
  top: 0;
  height: 100%;
  opacity: 0.1;
` as any;

export const StyledOrderRow = styled.tr`
  display: flex;
  align-items: center;
  border-bottom: solid 1px rgba(0, 0, 0, 0.08);

  & > td {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;
