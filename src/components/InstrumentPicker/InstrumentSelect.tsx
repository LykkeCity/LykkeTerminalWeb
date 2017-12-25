import * as React from 'react';
import {FAIcon} from '../Icon/Icon';
import styled from '../styled';
import {InstrumentPickerProps} from './index';

const InstrumentSelectContainer = styled.div`
  cursor: pointer;
`;

const InstrumentSelect: React.SFC<InstrumentPickerProps> = ({
  value = '',
  onShowInstrumentPicker = null,
  children
}) => (
  <InstrumentSelectContainer onClick={onShowInstrumentPicker}>
    <span>{value}</span>&nbsp;
    <FAIcon name="angle-down" />
    {children}
  </InstrumentSelectContainer>
);

export default InstrumentSelect;
