import {rem} from 'polished';
import * as React from 'react';
import styled from '../styled';

const StyledInstrumentListHeader = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
  padding: ${rem(10)};
  color: rgba(245, 246, 247, 0.4);

  &.double {
    width: 40%;
  }
  &.right-align {
    justify-content: flex-end;
  }
  &:after {
    content: '';
    margin-left: ${rem(10)};
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
  }
  &.ASC:after {
    border-bottom: 4px solid rgba(245, 246, 247, 0.4);
  }
  &.DESC:after {
    border-top: 4px solid rgba(245, 246, 247, 0.4);
  }
`;

interface InstrumentListHeaderProps {
  className?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  sort: any;
  sortByParam: string;
}

const InstrumentListHeader: React.SFC<InstrumentListHeaderProps> = ({
  sort,
  sortByParam,
  currentSortDirection,
  currentSortByParam,
  className,
  children
}) => {
  const sortList = () => sort(sortByParam, currentSortDirection);

  return (
    <StyledInstrumentListHeader
      className={`
        ${className}
        ${currentSortByParam === sortByParam ? currentSortDirection : ''}
      `}
      onClick={sortList}
    >
      {children}
    </StyledInstrumentListHeader>
  );
};

export default InstrumentListHeader;
