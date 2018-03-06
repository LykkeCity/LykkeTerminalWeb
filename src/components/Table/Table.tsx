import {rem} from 'polished';
import styled from '../styled';

const Table = styled.table`
  width: 100%;
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
    }
  }
  td {
    padding: ${rem(8)} ${rem(8)};
    text-align: right;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:first-child {
      color: #f5f6f7;
      font-weight: 600;
      text-align: left;
    }
  }
`;

export default Table;
