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
  value = '',
  onToggle,
  className
}) => (
  <div className={className} onClick={onToggle}>
    <Value>{value}</Value>&nbsp;
    {value && <FAIcon name="angle-down" />}
    <Label>Current asset-pair</Label>
  </div>
);

const StyledInstrumentSelect = styled(InstrumentSelect)`
  cursor: pointer;
  height: 100%;
  padding: ${rem(5)} ${rem(15)};
  min-width: ${rem(100)};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    height: 24px;
    margin-top: -12px;
    border-right: solid 1px rgba(0, 0, 0, 0.2);
  }
`;

const Value = styled.span`
  font-size: ${rem(16)};
  font-family: 'Akrobat', sans-serif;
  font-weight: bold;
`;

const Label = styled.small`
  color: #8c94a0;
  font-size: ${rem(12)};
  display: block;
`;

export default StyledInstrumentSelect;
