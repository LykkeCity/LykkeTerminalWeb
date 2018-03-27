import * as React from 'react';
import {TableHeaderItem} from './styles';

interface InstrumentListHeaderProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  onSort: any;
  sortByParam: string;
}

const TableHeader: React.SFC<InstrumentListHeaderProps> = ({
  onSort,
  sortByParam,
  currentSortDirection,
  currentSortByParam,
  className,
  children
}) => {
  const handleSortList = () => onSort(sortByParam, currentSortDirection);

  return (
    <TableHeaderItem
      className={`
        ${className}
        ${currentSortByParam === sortByParam ? currentSortDirection : ''}
      `}
      onClick={handleSortList}
    >
      {children}
    </TableHeaderItem>
  );
};

export default TableHeader;
