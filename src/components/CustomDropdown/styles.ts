import {
  Dropdown,
  DropdownContainer,
  DropdownList,
  DropdownListItem
} from '@lykkex/react-components';
import {rem} from 'polished';
import {withStyledScroll} from '../CustomScrollbar';
import styled from '../styled';

export const StyledDropdown = styled(Dropdown)`
  width: 100%;

  &.dropdown_open {
    .dropdown__control > div {
      border-color: ${props => props.theme.colors.dropdownItemBorder};
      border-radius: 4px 4px 0 0;
      box-shadow: 1px 10px 10px 0 ${props => props.theme.colors.boxShadow};

      border-bottom: ${rem(1)} solid
        ${props => props.theme.colors.dropdownItemBorder};
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
  width: 100%;
  min-height: calc(20px + ${rem(14)});
  padding: ${rem(6)} ${rem(18)};
  background-color: ${props => props.theme.colors.dropdownControlBackground};
  border: ${rem(1)} solid ${props => props.theme.colors.dropdownControlBorder};
  border-radius: 4px;
  color: ${props => props.theme.colors.text};

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
    width: 100%;
    top: calc(100% - calc(20px + ${rem(14)}));
    left: 0;
    margin-left: 0;
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
    width: 100%;
    height: 310px;
    padding: 0;
    margin-top: 0;
    box-shadow: 1px 10px 10px 0 ${props => props.theme.colors.boxShadow};
    border-radius: 4px;

    > div {
      border: none !important;
      border-radius: 4px 4px;
    }

    .dropdown-list {
      background: none;
    }

    li.dropdown-list__item {
      min-height: calc(20px + ${rem(14)});
      padding: ${rem(6)} ${rem(18)};
      border: ${rem(1)} solid ${props => props.theme.colors.dropdownItemBorder} !important;
      border-bottom: 0;
      border-top: 0;
      line-height: inherit;
      color: ${props => props.theme.colors.text} !important;
      border-radius: 0;

      &:hover {
        background-color: ${props =>
          props.theme.colors.dropdownHoveredItemBackground} !important;
        cursor: pointer;
      }

      &.isActive {
        background-color: ${props =>
          props.theme.colors.dropdownActiveItemBackground} !important;

        &:hover {
          background-color: ${props =>
            props.theme.colors.dropdownActiveItemBackground} !important;
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
  border: `${rem(1)} solid ${(props: any) =>
    props.theme.colors.dropdownItemBorder}`
})(styled(DropdownList)`
  background-color: ${props =>
    props.theme.colors.dropdownItemBackground} !important;
`);

export const StyledDropdownListItem = styled(DropdownListItem)`
  color: ${props => props.theme.colors.text} !important;
  background-color: ${props =>
    props.theme.colors.dropdownItemBackground} !important;
  padding: ${rem(10)};

  &:last-child {
    box-shadow: 1px 10px 10px 0 ${props => props.theme.colors.boxShadow};
  }

  &.active {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.dropdownActiveItemBackground};
  }
`;
