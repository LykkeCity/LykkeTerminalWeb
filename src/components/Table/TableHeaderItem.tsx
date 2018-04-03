import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import {TableHeaderItemEl} from './styles';

interface TableHeaderItemProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  onSort: any;
  sortByParam: string;
  sortDisabled?: boolean;
  style?: any;
}

const TableHeaderItem: React.SFC<TableHeaderItemProps> = ({
  onSort,
  sortDisabled,
  sortByParam,
  currentSortDirection,
  currentSortByParam,
  className,
  children,
  style
}) => {
  const handleSortList = () => {
    if (sortDisabled) {
      return;
    }
    onSort(sortByParam, currentSortDirection);
  };

  return (
    <TableHeaderItemEl
      className={`
        ${className}
        ${currentSortByParam === sortByParam ? currentSortDirection : ''}
        ${sortDisabled ? 'disabled' : ''}
      `}
      onClick={handleSortList}
      style={style}
    >
      <p data-tip={children}>{children}</p>

      <ReactTooltip effect={'solid'} />
    </TableHeaderItemEl>
  );
};

export default TableHeaderItem;
