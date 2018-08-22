import {rem} from 'polished';
import * as React from 'react';
import {Modal} from '../Modal/styles';
import styled, {chartPalette, colors} from '../styled';

export const ChartWrapper = styled.div`
  height: 100%;
  position: relative;
`;

export const ChartContainer = styled.div.attrs({
  style: (props: any) =>
    props.fullScreenMode
      ? ({
          position: 'fixed',
          left: 0,
          top: 0,
          padding: rem(28),
          zIndex: 99
        } as React.CSSProperties)
      : ({
          position: 'relative',
          padding: 0
        } as React.CSSProperties)
})`
  width: 100%;
  height: 100%;
  background-color: ${chartPalette.background};
` as any;

export const ChartControls = styled.div`
  display: flex;
  padding: ${rem(8)} 0};
`;

export const ChartControlsItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0 ${rem(12)};
  border-right: 1px solid ${colors.greyBorder};
  cursor: pointer;
  z-index: 99;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
    border: none;
  }

  > .icon {
    font-size: 1.2rem;
  }

  &.full-screen {
    margin-left: auto;
    color: ${colors.coolGrey};
    font-size: ${rem(16)};

    > .icon {
      margin-left: ${rem(12)};
    }

    &:hover {
      color: ${colors.whiteText};

      > .icon {
        color: ${colors.whiteText};
      }
    }
  }
`;

export const ControlButton = styled.div`
  position: relative;
`;

export const ButtonContent = styled.span`
  height: ${rem(16)};
  margin-right: ${rem(12)};
`;

export const ControlDropdownContainer = styled.div`
  position: absolute;
  margin-top: ${rem(8)};
  background-color: ${colors.graphiteBackground};
  box-shadow: 2px 8px 12px 0 rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  overflow: hidden;
`;

export const ChartControlList = styled.ul`
  margin: 0;
  padding: 0;
`;

export const ChartControlListItem = styled.li`
  padding: ${rem(12)} ${rem(16)};
  white-space: nowrap;

  &:hover:not(.isActive) {
    background-color: ${colors.lightGraphite};
  }

  &.isActive {
    background-color: ${colors.blue};
  }
`;

export const ControlPopupContainer = styled(Modal)`
  box-shadow: 2px 8px 16px 0 rgba(0, 0, 0, 0.25);
`;

export const IndicatorsList = styled(ChartControlList)`
  margin-top: ${rem(20)};
  border-top: 1px solid ${colors.greyBorder};
`;

export const IndicatorsListItem = styled(ChartControlListItem)`
  padding: ${rem(16)} 0;
  font-size: ${rem(16)};

  &:hover:not(.isActive) {
    background-color: transparent;
  }
`;

export const IndicatorsSwitcher = styled.div`
  display: inline-block;

  .switcher-container {
    color: inherit;
  }
`;
