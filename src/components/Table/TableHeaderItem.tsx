import * as React from 'react';
import {TableHeaderItemDiv} from './styles';

interface TableHeaderItemProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  onSort: any;
  sortByParam: string;
  style?: any;
}

const TableHeaderItem: React.SFC<TableHeaderItemProps> = ({
  onSort,
  sortByParam,
  currentSortDirection,
  currentSortByParam,
  className,
  children,
  style
}) => {
  const handleSortList = () => onSort(sortByParam, currentSortDirection);

  return (
    <TableHeaderItemDiv
      className={`
        ${className}
        ${currentSortByParam === sortByParam ? currentSortDirection : ''}
      `}
      onClick={handleSortList}
      style={style}
    >
      {children}
    </TableHeaderItemDiv>
  );
};

export default TableHeaderItem;
