import * as React from 'react';
import styled from '../styled';

const StyledNumber = styled.div.attrs({})`
  color: ${(p: any) => p.color};
  span {
    color: #f5f6f7;
  }
  &.up {
    color: #13b72a;
  }
  &.down {
    color: #ff3e2e;
  }
  .arrow {
    display: inline-block;
    margin-left: 8px;
    vertical-align: middle;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    &.up {
      border-bottom: 8px solid #13b72a;
    }
    &.down {
      border-top: 8px solid #ff3e2e;
    }
  }
`;

interface InstrumentListNumberProps {
  num: number;
  accuracy: number;
  color?: string;
  dynamics?: string;
  preSign?: string;
}

const InstrumentListNumber: React.SFC<InstrumentListNumberProps> = ({
  num,
  accuracy,
  color = '#ffffff',
  children,
  dynamics,
  preSign
}) => {
  if (num === undefined || num === null) {
    return null;
  }
  return (
    <StyledNumber color={color} className={dynamics}>
      {preSign}
      {num.toFixed(accuracy).replace(/[.,]?0+$/, '')}
      {children}
      {dynamics ? <div className={'arrow ' + dynamics} /> : ''}
    </StyledNumber>
  );
};

export default InstrumentListNumber;
