import {rem} from 'polished';
import {Side} from '../../models';
import styled from '../styled';

const colorBySide = (side: Side) =>
  side === Side.Sell ? '#d070ff' : '#ffae2c';

const volumeColorBySide = (side: Side) =>
  side === Side.Sell ? '#ab00ff' : '#fb8f01';

const alignBySide = (side: Side) => (side === Side.Sell ? 'right' : 'left');

const marginBySide = (side: Side) =>
  side === Side.Sell ? 'marginLeft' : 'marginRight';

export const StyledWrapper = styled.div`
  height: calc(100% - 50px);
  margin-right: -0.9375rem;
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
