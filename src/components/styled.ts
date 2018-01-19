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

const colorFromSide = (sideOrProps: any) => css`
  color: ${(sideOrProps.side || sideOrProps) === Side.Buy
    ? '#fb8f01'
    : '#d070ff'};
`;

export {css, injectGlobal, keyframes, ThemeProvider, colorFromSide};
export default styled;
