import {rem} from 'polished';
import styled from '../styled';

const TableScrolled = styled.table`
  width: 100%;
  margin-bottom: ${rem(10)};

  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;

  tbody {
    flex: 1 1 auto;
    display: block;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 6px;
      height: 128px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 100px;
      background-color: #464849;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #8c94a0;
    }
  }
  tbody tr {
    width: 100%;
  }
  thead,
  tbody tr {
    display: table;
    table-layout: fixed;
  }

  tr {
    line-height: 1;
  }
  thead {
    border-bottom: solid 1px #292929;
    flex: 0 0 auto;
    width: calc(100% - 0.9em);
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
    }
  }
  td {
    padding: ${rem(8)} ${rem(8)};
    text-align: right;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.1); */

    &:first-child {
      color: #f5f6f7;
      font-weight: 600;
      text-align: left;
    }
  }
`;

export default TableScrolled;
