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

export const Table = styled.table`
  width: 100%;
  margin-bottom: ${rem(10)};
  tr {
    line-height: 1;
  }
  th,
  td {
    min-width: 50px;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  th {
    position: relative;
    height: 30px;
    margin: 0;
    padding: 0;
    font-size: ${rem(14)};
    font-weight: normal;
    line-height: 1.14;
    color: ${colors.lightGrey};

    &:first-child {
      text-align: left;
      padding-left: 0;
    }
    &:last-child {
      text-align: right;
      padding-right: 0;
    }

    > p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  td {
    padding: ${rem(8)} ${rem(8)};
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.1); */

    &:first-child {
      color: #f5f6f7;
      font-weight: 600;
      text-align: left;
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }
`;

export const TableHeaderItemEl = styled.th`
  display: flex;
  align-items: center;
  color: ${colors.lightGrey};

  &.right-align {
    justify-content: flex-end;
  }
  &:not(.disabled) {
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
  }
`;
