import {ClickOutside} from '@lykkex/react-components';
import {rem} from 'polished';
import * as React from 'react';
import styled from '../styled';
import {InstrumentPopoverProps} from './index';

const InstrumentPopover: React.SFC<InstrumentPopoverProps> = ({
  className,
  children,
  onToggle
}) => {
  return (
    <ClickOutside onClickOutside={onToggle}>
      <div className={className}>{children}</div>
    </ClickOutside>
  );
};

const StyledInstrumentPopover = styled(InstrumentPopover)`
  border-radius: 6px;
  background-color: ${props => props.theme.colors.modalBackground};
  box-shadow: 0 10px 10px 0 ${props => props.theme.colors.boxShadow};
  border: solid 1px ${props => props.theme.colors.modalBorder};
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
