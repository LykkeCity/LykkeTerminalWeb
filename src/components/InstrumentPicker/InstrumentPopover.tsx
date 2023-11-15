import {ClickOutside} from '@lykkecity/react-components';
import {rem} from 'polished';
import * as React from 'react';
import styled, {colors} from '../styled';
import {InstrumentPickerActions} from './index';

export interface InstrumentPopoverProps extends InstrumentPickerActions {
  className?: string;
  style?: React.CSSProperties;
}

const InstrumentPopover: React.SFC<InstrumentPopoverProps> = ({
  className,
  style,
  children,
  onToggle
}) => {
  return (
    <ClickOutside onClickOutside={onToggle}>
      <div style={style} className={className}>
        {children}
      </div>
    </ClickOutside>
  );
};

const StyledInstrumentPopover = styled(InstrumentPopover)`
  border-radius: 6px;
  background-color: ${colors.graphiteBackground};
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(0, 0, 0, 0.2);
  position: absolute;
  padding: ${rem(8)} ${rem(16)};
  z-index: 999;
  transition: all 0.3s ease;
  width: 700px;
  height: 360px;
  top: 5px;
  font-size: ${rem(14)};
`;

export default StyledInstrumentPopover;
