import {rem} from 'polished';
import styled, {colors, fonts} from '../styled';
import chartConstants from './Chart/chartConstants';

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
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${rem(52)};
`;

export const Button = styled.button`
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
  margin: 0 1rem;
  height: 24px;
  width: 24px;
`;

export const Price = styled.div``;
