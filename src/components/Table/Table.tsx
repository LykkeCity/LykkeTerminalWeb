import {rem} from 'polished';
import styled from '../styled';

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  margin-bottom: ${rem(10)};
  tr {
    line-height: 1;
  }
  thead {
    border-bottom: solid 1px #292929;
  }
  th {
    text-align: right;
    padding: ${rem(7)};
    font-size: ${rem(14)};
    font-weight: normal;
    line-height: 1.14;
    color: #8c94a0;
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
    text-align: right;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

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

export default Table;
