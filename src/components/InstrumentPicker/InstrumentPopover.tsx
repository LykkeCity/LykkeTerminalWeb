import {ClickOutside} from '@lykkex/react-components';
import {rem} from 'polished';
import * as React from 'react';
import media from '../../constants/media';
import styled, {colors} from '../styled';
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
  background-color: ${colors.graphiteBackground};
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(0, 0, 0, 0.2);
  position: absolute;
  padding: ${rem(8)} ${rem(16)};
  z-index: 999;
  transition: all 0.3s ease;
  width: ${window.matchMedia(media.desktop).matches
    ? rem(700)
    : 'calc(100vw - 20px)'};
  height: 360px;
  top: 5px;
  font-size: ${rem(14)};
`;

export default StyledInstrumentPopover;
