import {rem} from 'polished';
import styled, {colors} from '../styled';

export const StyledTabContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const StyledTabContainerLabels = styled.div`
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
`;

export const StyledTab = styled.div`
  width: 100%;
  height: 100%;
`;

export const StyledTabTitle = styled.div`
  cursor: pointer;
  text-align: center;
  padding: ${rem(9)} 0 ${rem(11)};
  color: ${colors.coolGrey};
  font-size: ${rem(18)};
  border-bottom: 2px solid transparent;

  &:not(:last-child) {
    margin-right: ${rem(22)};
  }

  &:hover {
    cursor: pointer;
  }

  &.active {
    border-bottom-color: ${colors.blue};
    color: ${colors.snowWhite};
    font-weight: 600;
  }
`;
