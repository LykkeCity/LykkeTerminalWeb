import {rem} from 'polished';
import styled, {dims, fonts, padding} from '../styled';

export const TradeListToolbar = styled.div`
  display: flex;
  align-items: center;
  min-height: 45px;
  padding: ${padding(8, 0)};
  width: 100%;
`;

export const TradeFilterValue = styled.div`
  position: relative;
  font-size: ${rem(fonts.normal)};
  text-align: left;
  color: ${props => props.theme.colors.text};

  &:hover {
    cursor: pointer;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-top: 4px solid ${props => props.theme.colors.dropdownControlIcon};
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
  color: ${props => props.theme.colors.text};
  padding: ${padding(...dims.padding)};

  &:hover {
    cursor: pointer;
  }
`;
