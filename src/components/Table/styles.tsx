import {rem} from 'polished';
import styled, {colors} from '../styled';

export const Table = styled.table`
  width: 100%;
  margin-bottom: ${rem(10)};
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
