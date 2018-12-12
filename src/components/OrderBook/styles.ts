import {rem} from 'polished';
import styled, {
  buttonBackgrounds,
  buttonColors,
  colors,
  dims,
  fonts,
  padding
} from '../styled';
import {Table} from '../Table';

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
  margin: ${rem(16)} 0 ${rem(8)};
  width: 100%;
  tr {
    &:hover {
      background: transparent !important;
    }
  }
  th {
    text-align: left;
    padding: 0;

    &:first-child {
      padding-left: 50px !important;
    }
  }
`;

export const BarTh = styled.th`
  width: ${rem(50)} !important;
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
  padding: 0.5rem 1rem;
  position: sticky;
  top: 0;
  bottom: 0;
  z-index: 2;
`;

export const Figure = styled.div`
  cursor: ${(p: any) => (p.isAuth ? 'pointer' : 'initial')};
  cursor: initial;
  font-size: ${rem(fonts.normal)};
` as any;

export const FigureValue = styled.div`
  font-family: Lekton, monospace;
  font-weight: bold;
  text-align: center;
`;

export const FigureHint = styled.div`
  font-size: ${rem(fonts.small)};
  font-weight: normal;
  text-align: center;
  opacity: 0.4;
  cursor: default;
`;

export const LastPriceValue = FigureValue.extend.attrs({
  style: (props: any) => ({
    cursor: props.clickable ? 'pointer' : 'default'
  })
})`
  font-size: ${rem(fonts.extraLarge)};
  font-weight: bold;
` as any;

export const MidPrice = Figure.extend.attrs({
  style: (props: any) => ({
    cursor: props.clickable ? 'pointer' : 'default'
  })
})`
  margin-left: auto;
` as any;

export const Spread = Figure.extend`
  cursor: initial;
  margin-left: 30px;
`;

export const MidOverlay = styled.div`
  background: ${colors.lightGraphite};
  border: solid 1px rgba(140, 148, 160, 0.4);
  border-radius: 4px;
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

export const FakeOrderBookStage = styled.div.attrs({
  style: (props: any) => ({
    height: props.height,
    width: props.width,
    marginLeft: rem(props.left),
    marginBottom: rem(-props.bottom)
  })
})`
  position: absolute;
  z-index: 1;
  cursor: pointer;
` as any;

export const Button = styled.button`
  cursor: pointer;
  background: ${(props: any) =>
    !props.disabled ? buttonBackgrounds.normal : buttonBackgrounds.disabled};
  border: none;
  border-radius: 4px;
  color: ${(props: any) =>
    !props.disabled ? buttonColors.normal : buttonColors.disabled};
  outline: none;
  padding: 0;
  height: 24px;
  width: 24px;

  i {
    font-size: ${rem(fonts.small)};
  }

  &:hover {
    background: ${(props: any) =>
      !props.disabled ? buttonBackgrounds.hovered : buttonBackgrounds.disabled};
  }

  &:active {
    background: ${(props: any) =>
      !props.disabled ? buttonBackgrounds.pressed : buttonBackgrounds.disabled};
  }

  &:hover svg {
    color: ${(props: any) =>
      !props.disabled ? buttonColors.hovered : buttonColors.disabled};
  }

  &:active svg {
    color: ${(props: any) =>
      !props.disabled ? buttonColors.pressed : buttonColors.disabled};
  }
`;
