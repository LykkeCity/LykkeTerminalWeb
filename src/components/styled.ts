import {lighten, rem} from 'polished';
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
    ? '#fb8f01'
    : '#d070ff'};
`;

export const colors = {
  blue: '#0388ef',
  darkGraphite: 'rgba(0, 0, 0, 0.2)',
  lightGraphite: 'rgb(51, 51, 51)',
  lightGrey: 'rgba(245, 246, 247, 0.4)',
  graphiteBorder: 'rgba(0, 0, 0, 0.1)',
  white: 'rgb(245, 246, 247)'
};

export const fonts = {
  normal: 14,
  large: 16
};

export const dims = {
  headerHeight: 50,
  tileHeaderHeight: 40,
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

export {css, injectGlobal, keyframes, ThemeProvider};
export default styled;
