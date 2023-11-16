import {observer} from 'mobx-react';
import * as React from 'react';
import {InstrumentNumber} from './styles';

interface InstrumentListNumberProps {
  num: string;
  color?: string;
  dynamics?: string;
  sign?: string;
}

const InstrumentListNumber: React.SFC<InstrumentListNumberProps> = observer(
  ({num, color, children, dynamics, sign}) => {
    if (num === undefined || num === null) {
      return null;
    }

    const afterSign = children
      ? Array.isArray(children)
        ? children.join('')
        : children
      : '';
    const title = `${sign || ''} ${num} ${afterSign}`;

    return (
      <InstrumentNumber
        color={color || ''}
        className={dynamics || ''}
        title={title}
      >
        {sign}
        {num || 0}
        {children}
      </InstrumentNumber>
    );
  }
);

export default InstrumentListNumber;
