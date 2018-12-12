import {rem} from 'polished';
import styled, {colors, fonts} from '../styled';

export const StyledInstrumentPerformance = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledInstrumentPerformanceFigure = styled.div`
  padding: 0 ${rem(16)};
`;

export const InstrumentPerformanceFigureValue = styled.div`
  font-size: ${rem(fonts.large)};
  font-weight: bold;
  font-family: Lekton, monospace;
  color: ${(p: any) => p.color || colors.white};
  text-align: left;
` as any;

export const InstrumentPerformanceFigureLabel = styled.small`
  color: #8c94a0;
  font-size: ${rem(fonts.small)};
`;
