import * as React from 'react';
import Dir from '../../stores/dir';

interface InstrumentFieldProps {
  dir?: Dir;
  className?: string;
}

const InstrumentField: React.SFC<InstrumentFieldProps> = ({
  children,
  className
}) => <div className={className}>{children}</div>;

export default InstrumentField;
