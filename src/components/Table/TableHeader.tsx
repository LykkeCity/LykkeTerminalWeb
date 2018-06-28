import * as React from 'react';
import {
  HeaderCell,
  Table,
  TableHeaderItem,
  TableHeaderWithoutSortItem
} from '.';

export interface HeaderProps {
  key: string;
  value?: string;
  width?: number;
  className?: string;
  sortDisabled?: boolean;
}

interface TableHeaderProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  headers: HeaderProps[];
  onSort: any;
}

interface TableHeaderWithoutSortProps {
  className?: string;
  headers: HeaderProps[];
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

export const TableHeaderWithoutSort: React.SFC<TableHeaderWithoutSortProps> = ({
  className,
  headers
}) => {
  return (
    <Table className={`header ${className || ''}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <HeaderCell w={header.width} key={index}>
              <TableHeaderWithoutSortItem className={header.className}>
                {header.value}
              </TableHeaderWithoutSortItem>
            </HeaderCell>
          ))}
        </tr>
      </thead>
    </Table>
  );
};
