import {
  Dropdown,
  DropdownContainer,
  DropdownList,
  DropdownListItem
} from 'lykke-react-components';
import {rem} from 'polished';
import {withStyledScroll} from '../CustomScrollbar';
import styled, {colors} from '../styled';

const DROPDOWN_WIDTH = 175;

export const StyledDropdown = styled(Dropdown)`
  width: ${DROPDOWN_WIDTH}px;

  &.dropdown_open {
    .dropdown__control > div {
      border-color: ${colors.greyBorder};
      border-radius: 4px 4px 0 0;
      box-shadow: 1px 10px 10px 0 rgba(0, 0, 0, 0.2);
    }
  }

  &:not(.dropdown_open) {
    .dropdown__container {
      visibility: hidden !important;
    }
  }
`;

export const StyledDropdownControlParent = styled.div`
  float: right;
  padding-top: 3px;
`;

export const StyledDropdownControlButton = styled.div`
  position: relative;
  width: ${DROPDOWN_WIDTH}px;
  min-height: calc(20px + ${rem(20)});
  padding: ${rem(10)};
  background-color: ${colors.grey};
  border: ${rem(1)} solid #5c5f64;
  border-radius: 4px;
  color: ${colors.white};

  &:first-letter {
    text-transform: capitalize;
  }

  &:hover {
    cursor: pointer;
  }

  svg {
    float: right;
  }
`;

export const StyledDropdownContainer = styled(DropdownContainer)`
  &.dropdown__container {
    padding-top: 0;
    transform: none !important;
    transition: none !important;

    &:hover,
    &:focus {
      transform: none !important;
      transition: none !important;
    }
  }

  .dropdown__nav {
    background: none;
    height: 310px;
    padding: 0;
    margin-top: -1px;
    border-radius: 0;
    box-shadow: 1px 10px 10px 0 rgba(0, 0, 0, 0.2);
    border-radius: 0 0 4px 4px;

    > div {
      border: none !important;
      border-radius: 0 0 4px 4px;
    }

    .dropdown-list {
      background: none;
    }

    li.dropdown-list__item {
      border: ${rem(1)} solid ${colors.greyBorder};
      border-bottom: 0;
      line-height: normal;
      color: ${colors.whiteText};
      border-radius: 0;

      &:hover {
        background-color: ${colors.grey};
        cursor: pointer;
      }

      &.isActive {
        background-color: ${colors.blue};

        &:hover {
          background-color: ${colors.blue};
        }
      }

      &:last-child {
        border-radius: 0 0 4px 4px;
      }
    }
  }
`;

export const StyledDropdownList = withStyledScroll({
  height: '100%',
  border: `${rem(1)} solid ${colors.greyBorder}`
})(styled(DropdownList)`
  background-color: ${colors.grey};
`);

export const StyledDropdownListItem = styled(DropdownListItem)`
  background-color: ${colors.grey};
  padding: ${rem(10)};
  box-shadow: 1px 10px 10px 0 rgba(0, 0, 0, 0.2);
`;
