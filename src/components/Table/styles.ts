import {rem} from 'polished';
import styled, {colors} from '../styled';

interface CellProps {
  w?: string | number;
}

const width = (w: string | number | undefined) =>
  (w && (w.toString().endsWith('%') ? w : rem(w))) || 'inherit';

export const Cell = styled.td`
  width: ${(p: CellProps) => width(p.w)};
` as any;

export const HeaderCell = styled.th`
  width: ${(p: CellProps) => width(p.w)};
` as any;

export const TableHeaderItem = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.lightGrey};

  &.right-align {
    justify-content: flex-end;
  }
  &:after {
    content: '';
    margin-left: ${rem(10)};
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
  }
  &.ASC:after {
    border-bottom: 4px solid ${colors.lightGrey};
  }
  &.DESC:after {
    border-top: 4px solid ${colors.lightGrey};
  }
`;
