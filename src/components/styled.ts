import {darken, lighten, rem, rgb} from 'polished';
import * as styledComponents from 'styled-components';
import {ThemedStyledComponentsModule} from 'styled-components';
import {Side} from '../models/index';
import ThemeInterface from './theme';

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<ThemeInterface>;

export const colorFromSide = (sideOrProps: any) => css`
  color: ${(sideOrProps.side || sideOrProps) === Side.Buy
    ? colors.buy
    : colors.sell};
`;

export const colors = {
  blue: '#0388ef',
  green: '#46eb6a',
  red: '#ff6161',
  coolGrey: '#8c94a0',
  darkGraphite: 'rgba(0, 0, 0, 0.2)',
  lightGraphite: 'rgb(51, 51, 51)',
  lightGrey: 'rgba(245, 246, 247, 0.4)',
  graphiteBorder: 'rgba(0, 0, 0, 0.1)',
  greyBorder: '#272727',
  white: 'rgb(245, 246, 247)',
  buy: rgb(70, 235, 106),
  sell: rgb(255, 97, 97),
  grey: '#3c3c3c',
  brightMango: '#ffae2c',
  brightViolet: '#ab00ff',
  violet: '#d070ff',
  mango: '#fb8f01',
  lightWhite: 'rgba(255, 255, 255, 0.4)',
  snowWhite: '#fff',
  whiteText: '#f5f6f7',
  graphiteBackground: '#3e3e3e'
};

export const buttonBackgrounds = {
  normal: rgb(39, 39, 39),
  hovered: darken(0.1, rgb(39, 39, 39)),
  pressed: darken(0.2, rgb(39, 39, 39)),
  disabled: lighten(0.05, rgb(39, 39, 39))
};

export const buttonColors = {
  normal: colors.white,
  hovered: lighten(0.1, colors.white),
  pressed: lighten(0.2, colors.white),
  disabled: darken(0.3, colors.white)
};

export const fonts = {
  small: 12,
  normal: 14,
  large: 16,
  extraLarge: 24
};

export const dims = {
  headerHeight: 60,
  tileHeaderHeight: 32,
  padding: [8, 16]
};

export const padding = (...paddings: number[]) =>
  paddings.map(p => rem(p)).join(' ');

export const iconCss = css`
  i {
    cursor: pointer;
    color: #d8d8d8;
    &:hover {
      color: ${lighten(0.2)('#d8d8d8')};
    }
  }
`;

export const greyButton = {
  borderColor: 'rgba(140, 148, 160, 0.4)',
  borderRadius: '4px'
};

export const chartPalette = {
  candleUp: 'rgb(70, 235, 106)',
  candleDown: 'rgb(255, 97, 97)',
  volumeUp: '#1C8C35',
  volumeDown: '#B03C3C'
};

export const tableScrollMargin = '1rem';

export {css, injectGlobal, keyframes, ThemeProvider};
export default styled;
