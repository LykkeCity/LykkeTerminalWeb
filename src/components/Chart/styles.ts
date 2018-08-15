import {rem} from 'polished';
import styled, {chartPalette, greyButton, svgPaths} from '../styled';

export const ChartWrapper = styled.div`
  height: 100%;
  position: relative;
`;

export const ChartContainer = styled.div`
  height: 100%;
`;

export const TransparentDiv = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: none;
`;

export const ChartControlBar = styled.div`
  position: absolute;
  display: flex;
  right: 0;
  z-index: 1;
`;

export const ChartControlButton = styled.div`
  margin-left: ${rem(8)};
  border: 1px solid ${greyButton.borderColor};
  border-radius: ${greyButton.borderRadius};
  cursor: pointer;

  &:hover {
    border-color: ${chartPalette.buttonContext};
  }
`;

export const ButtonWithImg = styled(ChartControlButton)`
  padding: ${rem(6)} ${rem(16)};
`;

export const SvgButton = styled.svg`
  width: ${rem(26)};
  height: ${rem(18)};
  fill: ${chartPalette.buttonContext};
`;

export const ChartPlaceholder = styled.div.attrs({
  style: (props: any) => ({
    display: props.isReady ? 'none' : 'block'
  })
})`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${chartPalette.background};
` as any;

export const loadPath = svgPaths.load;
export const savePath = svgPaths.save;
