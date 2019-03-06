import {rem} from 'polished';
import styled, {colors, dims, fonts, padding} from '../styled';

export const TradeListToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 45px;
  padding: ${padding(8, 0)};
  width: 100%;
`;

export const TradeFilterValue = styled.div`
  position: relative;
  font-size: ${rem(fonts.normal)};
  text-align: left;
  color: ${colors.white};

  &:hover {
    cursor: pointer;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-top: 4px solid rgba(245, 246, 247, 0.4);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: relative;
    top: 10px;
    left: 10px;
  }
`;

export const StyledLoadMore = styled.div`
  display: flex;
  justify-content: center;
  margin: ${rem(8)} 0;
  width: 100%;
`;

export const StyledLoadMoreButton = styled.span`
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: ${colors.white};
  padding: ${padding(...dims.padding)};

  &:hover {
    cursor: pointer;
  }
`;

export const ExportButton = styled.span`
  font-size: ${rem(fonts.normal)};
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  color: #8c94a0;
  padding: ${padding(...dims.padding)};
  cursor: not-allowed;

  &.clickable {
    color: ${colors.white};
    cursor: pointer;
  }
`;

export const ClearFiltersButton = ExportButton;

export const FiltersWrapper = styled.div`
  display: flex;

  > div {
    padding: 8px 25px 0 18px;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    height: 32px;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      border-right: 0;
    }
  }
`;

export const StyledEmptyState = styled.td`
  text-align: center !important;
  padding: 70px 0 !important;
  color: #ffffff;
`;

export const ActionsWrapper = styled.div``;
