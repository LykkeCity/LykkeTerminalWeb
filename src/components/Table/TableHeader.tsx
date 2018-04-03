import * as React from 'react';
import {Table, TableHeaderItem} from '.';

interface TableHeaderProps {
  backgroundColor?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  headers: any[];
  onSort: any;
}

const TableHeader: React.SFC<TableHeaderProps> = ({
  backgroundColor,
  currentSortDirection,
  currentSortByParam,
  headers,
  onSort
}) => {
  return (
    <Table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <TableHeaderItem
              key={index}
              className={header.className}
              currentSortDirection={currentSortDirection}
              currentSortByParam={currentSortByParam}
              sortByParam={header.key}
              sortDisabled={header.sortDisabled}
              style={{
                backgroundColor
              }}
              onSort={onSort}
            >
              {header.value}
            </TableHeaderItem>
          ))}
        </tr>
      </thead>
    </Table>
  );
};

export default TableHeader;
