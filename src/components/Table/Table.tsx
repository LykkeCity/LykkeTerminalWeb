import styled from '../styled';

const Table = styled.div`
  width: 100%;
  .thead {
    border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  }
  .tr {
    display: flex;
    justify-content: space-evenly;
  }
  .th {
    flex-grow: 1;
    text-align: center;
    padding: 10px 5px;
    color: #8c94a0;
    &:first-child {
      text-align: left;
    }
    &:last-child {
      text-align: right;
    }
  }
  .td {
    flex-grow: 1;
    padding: 10px 5px;
    font-weight: 400;
    text-align: center;
    &:first-child {
      color: #fff;
      font-weight: 600;
      text-align: left;
    }
    &:last-child {
      text-align: right;
    }
  }
`;

export default Table;
