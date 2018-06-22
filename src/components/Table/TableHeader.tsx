import * as React from 'react';
import {HeaderCell, Table, TableHeaderItem, TableHeaderNoSortItem} from '.';

interface TableHeaderProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  headers: any[];
  onSort: any;
}

interface TableHeaderNoSortProps {
  className?: string;
  headers: any[];
}

export const TableHeader: React.SFC<TableHeaderProps> = ({
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

export const TableHeaderNoSort: React.SFC<TableHeaderNoSortProps> = ({
  className,
  headers
}) => {
  return (
    <Table className={`header ${className || ''}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <HeaderCell w={header.width} key={index}>
              <TableHeaderNoSortItem className={header.className}>
                {header.value}
              </TableHeaderNoSortItem>
            </HeaderCell>
          ))}
        </tr>
      </thead>
    </Table>
  );
};
