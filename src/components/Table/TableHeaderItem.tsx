import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import {TableHeaderItemEl, TruncatedText} from './styles';

interface TableHeaderItemProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  onSort: any;
  sortByParam: string;
  sortDisabled?: boolean;
}

interface TableHeaderWithoutSortItemProps {
  className?: string;
}

export const TableHeaderItem: React.SFC<TableHeaderItemProps> = ({
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

export const TableHeaderWithoutSortItem: React.SFC<
  TableHeaderWithoutSortItemProps
> = ({className, children}) => (
  <TableHeaderItemEl className={`${className || ''} disabled`}>
    <TruncatedText data-tip={children}>{children}</TruncatedText>

    <ReactTooltip effect={'solid'} />
  </TableHeaderItemEl>
);
