import {rem} from 'polished';
import styled from '../styled';

const Table = styled.table`
  width: 100%;
  margin-top: ${rem(3)};
  tr {
    line-height: 0.4;
  }
  thead {
    border-bottom: solid 1px rgba(0, 0, 0, 0.2);
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
    padding: 10px 5px;
    text-align: right;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &:first-child {
      color: #f5f6f7;
      font-weight: 600;
      text-align: left;
    }
  }
`;

export default Table;
