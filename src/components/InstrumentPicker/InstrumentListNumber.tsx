import {observer} from 'mobx-react';
import * as React from 'react';
import {InstrumentNumber} from './styles';

interface InstrumentListNumberProps {
  num: number;
  accuracy: number;
  active?: boolean;
  color?: string;
  dynamics?: string;
  preSign?: string;
}

const InstrumentListNumber: React.SFC<InstrumentListNumberProps> = observer(
  ({num, accuracy, color, active, children, dynamics, preSign}) => {
    if (num === undefined || num === null) {
      return null;
    }
    return (
      <InstrumentNumber
        color={color || ''}
        className={`${active ? 'active' : ''} ${dynamics}`}
      >
        {preSign}
        {num.toFixed(accuracy).replace(/[.,]?0+$/, '')}
        {children}
      </InstrumentNumber>
    );
  }
);

export default InstrumentListNumber;
