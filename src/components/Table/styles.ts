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

export const TableHeaderItemEl = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  color: ${colors.coolGrey};

  &.right-align {
    justify-content: flex-end;
  }
  &:not(.disabled) {
    cursor: pointer;

    &:after {
      display: none;
      content: '';
      margin-left: ${rem(10)};
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
    }
    &.ASC:after {
      display: block;
      border-bottom: 5px solid ${colors.coolGrey};
    }
    &.DESC:after {
      display: block;
      border-top: 5px solid ${colors.coolGrey};
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  tr {
    line-height: 1;
  }
  thead {
    border-bottom: solid 1px #292929;
  }
  th,
  td {
    text-align: right;
  }
  th {
    position: relative;
    padding: ${rem(7)};
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
  }
  td {
    padding: ${rem(8)};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

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

  &.header {
    margin: 0;

    &.instruments {
      margin: ${rem(8)} 0 0;

      th {
        &:first-child {
          padding: ${rem(8)} ${rem(24)} ${rem(8)} 0;
        }
        &:not(:first-child) {
          padding: ${rem(8)} ${rem(12)};
        }

        * {
          color: ${colors.coolGrey};
        }
      }
    }
  }
`;
