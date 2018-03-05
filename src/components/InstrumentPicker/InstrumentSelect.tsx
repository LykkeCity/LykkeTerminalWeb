import {rem} from 'polished';
import * as React from 'react';
import {FAIcon} from '../Icon/Icon';
import styled from '../styled';
import {InstrumentPickerActions} from './index';

interface InstrumentPickerProps extends InstrumentPickerActions {
  value: string;
  className?: string;
}

const InstrumentSelect: React.SFC<InstrumentPickerProps> = ({
  value = 'Choose instrument',
  onToggle,
  className
}) => (
  <div className={className} onClick={onToggle}>
    <span>{value}</span>&nbsp;
    <FAIcon name="angle-down" />
  </div>
);

const StyledInstrumentSelect = styled(InstrumentSelect)`
  font-family: 'Akrobat', sans-serif;
  font-weight: bold;
  cursor: pointer;
  height: 100%;
  padding: ${rem(5)} ${rem(15)};

  & > span {
    font-size: 1rem;
  }
`;

export default StyledInstrumentSelect;
