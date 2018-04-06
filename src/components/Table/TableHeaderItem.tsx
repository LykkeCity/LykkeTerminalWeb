import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import {TruncatedText} from '../Table/styles';
import {TableHeaderItemEl} from './styles';

interface TableHeaderItemProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  onSort: any;
  sortByParam: string;
  sortDisabled?: boolean;
}

const TableHeaderItem: React.SFC<TableHeaderItemProps> = ({
  onSort,
  sortDisabled,
  sortByParam,
  currentSortDirection,
  currentSortByParam,
  className,
  children
}) => {
  const handleSortList = () => {
    if (sortDisabled) {
      return;
    }
    onSort(sortByParam, currentSortDirection);
  };

  return (
    <TableHeaderItemEl
      onClick={handleSortList}
      className={`
        ${sortDisabled ? 'disabled' : ''}
        ${className || ''}
        ${currentSortByParam === sortByParam ? currentSortDirection : ''}
      `}
    >
      <TruncatedText data-tip={children}>{children}</TruncatedText>

      <ReactTooltip effect={'solid'} />
    </TableHeaderItemEl>
  );
};

export default TableHeaderItem;
