import {rem} from 'polished';
import styled, {fonts} from '../styled';

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
  font-family: 'Akrobat', sans-serif;
  color: ${(props: any) => props.color || props.theme.colors.headerFigureValue};
  text-align: left;
` as any;

export const InstrumentPerformanceFigureLabel = styled.small`
  color: ${props => props.theme.colors.headerFigureLabel};
  font-size: ${rem(fonts.small)};
`;
