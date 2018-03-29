import {rem} from 'polished';
import styled, {greyButton} from '../styled';

export const ChartWrapper = styled.div`
  height: 100%;
`;

export const ChartContainer = styled.div`
  height: 100%;
`;

export const ResetButton = styled.div`
  position: absolute;
  right: ${rem(16)};
  padding: ${rem(8)} ${rem(16)};
  border: 1px solid ${greyButton.borderColor};
  border-radius: ${greyButton.borderRadius};
  z-index: 1;
  cursor: pointer;
`;
