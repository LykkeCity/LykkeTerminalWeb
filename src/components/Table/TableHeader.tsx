import * as React from 'react';
import {HeaderCell, Table, TableHeaderItem} from '.';

interface TableHeaderProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  headers: any[];
  onSort: any;
}

const TableHeader: React.SFC<TableHeaderProps> = ({
  className,
  currentSortDirection,
  currentSortByParam,
  headers,
  onSort
}) => {
  return (
    <Table className={`header ${className || ''}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <HeaderCell w={header.width} key={index}>
              <TableHeaderItem
                className={header.className}
                currentSortDirection={currentSortDirection}
                currentSortByParam={currentSortByParam}
                sortByParam={header.key}
                sortDisabled={header.sortDisabled}
                onSort={onSort}
              >
                {header.value}
              </TableHeaderItem>
            </HeaderCell>
          ))}
        </tr>
      </thead>
    </Table>
  );
};

export default TableHeader;
