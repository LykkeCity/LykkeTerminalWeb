import {rem} from 'polished';
import * as styledComponents from 'styled-components';
import {Side} from '../models/index';
import darkTheme from '../themes/dark';
import lightTheme from '../themes/light';
import {Dictionary} from '../types';

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents;

export interface ThemeObject {
  colors: Dictionary<string>;
  buttonBackgrounds: Dictionary<string>;
  buttonColors: Dictionary<string>;
}

export const themes = {
  dark: darkTheme,
  light: lightTheme
};

export const colorFromSide = (sideOrProps: any) => css`
  color: ${(sideOrProps.side || sideOrProps) === Side.Buy
    ? sideOrProps.theme.colors.levelListBuy
    : sideOrProps.theme.colors.levelListSell};
`;

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

export const greyButton = {
  borderColor: 'rgba(140, 148, 160, 0.4)',
  borderRadius: '4px'
};

export const chartPalette = {
  background: '#333333',
  buttonContext: '#8e8e92',
  candleUp: 'rgb(70, 235, 106)',
  candleDown: 'rgb(255, 97, 97)',
  volumeUp: '#1C8C35',
  volumeDown: '#B03C3C'
};

export const tableScrollMargin = '1rem';

export const svgPaths = {
  load:
    'M12 0C8.4 0 5.4 2.8 5.1 6.3 2 6.1.1 9 0 11.1 0 13.9 2.2 16 4.7 16h4.9l-1-1H4.7C2.8 15 1 13.3 1 11.2 1 9 3 6.7 6 7.4 6 3 9 1 12 1s3.7 1.2 5.1 2.9c1.5.1 3.3.6 4.2 1.7 1 1.5 1.2 2.6 1.2 4.2 1.4.4 2.5 1.5 2.5 2.7-.2 1.6-1.3 2.5-2.6 2.5h-5l-1 1h5.9c2.8 0 3.7-1.9 3.7-3.5s-1-3-2.5-3.4c0-1.6-.5-2.9-1.4-4.1-.9-1.2-2.7-2-4.5-2.1C16.3 1.2 14.3 0 12 0zm-2 7v5H7l6 6 6-6h-3V7h-6zm1 1h4v5h1.6L13 16.6 9.4 13H11V8z',
  save:
    'M12 0C8.4 0 5.4 2.8 5.1 6.3 2 6.1.1 9 0 11.1 0 13.9 2.2 16 4.7 16H9v-1H4.7C2.8 15 1 13.3 1 11.2 1 9 3 6.7 6 7.4 6 3 9 1 12 1s3.7 1.2 5.1 2.9c1.5.1 3.3.6 4.2 1.7 1 1.5 1.2 2.6 1.2 4.2 1.4.4 2.5 1.5 2.5 2.7-.2 1.6-1.3 2.5-2.6 2.5H17v1h5.3c2.8 0 3.7-1.9 3.7-3.5s-1-3-2.5-3.4c0-1.6-.5-2.9-1.4-4.1-.9-1.2-2.7-2-4.5-2.1C16.3 1.2 14.3 0 12 0zm1 6l-6 6h3v5h6v-5h3l-6-6z'
};

export {css, injectGlobal, keyframes, ThemeProvider};
export default styled;
