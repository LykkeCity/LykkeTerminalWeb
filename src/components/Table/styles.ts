import {rem} from 'polished';
import styled, {colorFromSide, colors, tableScrollMargin} from '../styled';

interface CellProps {
  w?: string | number;
}

const width = (w: string | number | undefined) =>
  (w && (w.toString().endsWith('%') ? w : rem(w))) || 'inherit';

export const Cell = styled.td.attrs({
  style: (props: any) => ({
    cursor: `${props.clickable ? 'pointer' : 'default'}`,
    fontFamily: props.fontFamily || '',
    fontWeight: props.fontWeight || 'normal'
  })
})`
  width: ${(p: CellProps) => width(p.w)};
` as any;

export const HeaderCell = styled.th`
  width: ${(p: CellProps) => width(p.w)};
` as any;

export const TruncatedText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ColoredText = styled.div`
  ${(side: string) => colorFromSide(side)};
  font-weight: 500;
` as any;

export const TableHeaderItemEl = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.coolGrey};

  &.right-align {
    justify-content: flex-end;
  }
  &.center-align {
    justify-content: center;
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
  width: calc(100% - ${tableScrollMargin});
  table-layout: fixed;
  tr {
    line-height: 1;
  }
  thead {
    border-bottom: solid 1px #272727;
  }
  tbody {
    tr:hover {
      background-color: ${colors.graphiteBorder};
    }
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
      padding-left: ${rem(4)};
    }
    &:last-child {
      padding-right: ${rem(4)};
    }
  }

  &.header {
    width: 100%;
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

Cell.displayName = 'Cell';
