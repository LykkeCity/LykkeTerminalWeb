import {rem} from 'polished';
import chartConstants from '../../constants/chartConstants';
import styled, {fonts} from '../styled';

export const FillHeight = styled.div`
  height: 100%;
  position: relative;
`;

export const AbsoluteCentered = styled.div`
  background: transparent;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${chartConstants.labelsWidth}px;
`;

export const Bar = styled.div`
  border-radius: ${rem(4)};
  background: ${props => props.theme.colors.mainBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${rem(52)};
`;

export const Button = styled.button`
  cursor: pointer;
  background: ${(props: any) =>
    !props.disabled
      ? props.theme.buttonBackgrounds.normal
      : props.theme.buttonBackgrounds.disabled};
  border: none;
  border-radius: 4px;
  color: ${(props: any) =>
    !props.disabled
      ? props.theme.buttonColors.normal
      : props.theme.buttonColors.disabled};
  outline: none;
  padding: 0;
  margin: 0 1rem;
  height: 24px;
  width: 24px;

  i {
    font-size: ${rem(fonts.small)};
  }

  &:hover {
    background: ${(props: any) =>
      !props.disabled
        ? props.theme.buttonBackgrounds.hovered
        : props.theme.buttonBackgrounds.disabled};
  }

  &:active {
    background: ${(props: any) =>
      !props.disabled
        ? props.theme.buttonBackgrounds.pressed
        : props.theme.buttonBackgrounds.disabled};
  }

  &:hover svg {
    color: ${(props: any) =>
      !props.disabled
        ? props.theme.buttonColors.hovered
        : props.theme.buttonColors.disabled};
  }

  &:active svg {
    color: ${(props: any) =>
      !props.disabled
        ? props.theme.buttonColors.pressed
        : props.theme.buttonColors.disabled};
  }
`;

export const ChartContainer = styled.div`
  position: relative;
`;

export const LevelContainer = styled.div`
  position: absolute;
`;

export const Price = styled.div``;
