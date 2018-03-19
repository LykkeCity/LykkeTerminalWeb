import styled from '../styled';

const ReactStyledTable = styled.div`
  overflow: auto;
  .table {
    > div.rt-table {
      overflow: hidden;
    }
  }
  .no-border {
    border: none !important;
  }
  .header {
    padding: 10px 0 !important;
    color: rgba(245, 246, 247, 0.4);
    white-space: normal !important;
    outline: none;
    &.-sort-asc {
      box-shadow: inset 0 3px 0 0 rgba(0, 0, 0, 0.25) !important;
    }
    &.-sort-desc {
      box-shadow: inset 0 -3px 0 0 rgba(0, 0, 0, 0.25) !important;
    }
  }
  .left-align {
    text-align: left;
  }
  .right-align {
    text-align: right;
  }
  .buy {
    color: #fb8f01;
  }
  .sell {
    color: #d070ff;
  }
`;

export default ReactStyledTable;
