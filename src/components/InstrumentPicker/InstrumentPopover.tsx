import {rem} from 'polished';
import * as React from 'react';
import styled from '../styled';

interface InstrumentPopoverProps {
  show: boolean;
  className?: string;
}

const InstrumentPopover: React.SFC<InstrumentPopoverProps> = ({
  className,
  children
}) => <div className={className}>{children}</div>;

const StyledInstrumentPopover = styled(InstrumentPopover)`
  border-radius: 6px;
  background-color: rgb(60, 60, 60);
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(0, 0, 0, 0.2);
  position: absolute;
  padding: ${rem(20)} ${rem(5)};
  z-index: 999;
  transition: all 0.3s ease;
  min-width: 200px;
  top: 40px;
  left: 10px;
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
`;

export default StyledInstrumentPopover;
