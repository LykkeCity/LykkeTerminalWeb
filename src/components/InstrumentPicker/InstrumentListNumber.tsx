import {observer} from 'mobx-react';
import * as React from 'react';
import {InstrumentNumber} from './styles';

interface InstrumentListNumberProps {
  num: string;
  color?: string;
  dynamics?: string;
  preSign?: string;
}

const InstrumentListNumber: React.SFC<InstrumentListNumberProps> = observer(
  ({num, color, children, dynamics, preSign}) => {
    if (num === undefined || num === null) {
      return null;
    }

    const afterSign = children
      ? typeof children === 'object' ? children.join('') : children
      : '';
    const title = `${preSign || ''} ${num} ${afterSign}`;

    return (
      <InstrumentNumber
        color={color || ''}
        className={dynamics || ''}
        title={title}
      >
        {preSign}
        {num || 0}
        {children}
      </InstrumentNumber>
    );
  }
);

export default InstrumentListNumber;
