import classnames from 'classnames';
import * as React from 'react';
import styled from 'styled-components';
import {withStyledScroll} from '../CustomScrollbar';
import {colors, css} from '../styled';

import {rem} from 'polished';

const StyledSelect = styled.div`
  position: absolute;
  border: 1px solid #f5f6f7;
  z-index: 11;
  background-color: rgb(60, 60, 60);
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(0, 0, 0, 0.2);
  text-align: left;
  overflow: hidden;
  font-size: ${rem(14)};
`;

const StyledList = styled.div`
  overflow: auto;
`;

const StyledItem = styled.li.attrs({
  style: (props: any) => ({
    background: props.isActive ? colors.blue : 'transparent'
  })
})`
  cursor: pointer;
  font-size: 1rem;
  padding: ${rem(10)};
  border-top: 1px solid rgba(0, 0, 0, 0.2);

  &.reset-option {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  ${(p: any) =>
    p.isActive ||
    css`
      &:hover {
        background-color: rgba(0, 0, 0, 0.2) !important;
      }
    `};
` as any;

export const StyledInput = styled.input`
  background-color: transparent;
  border-radius: 4px;
  border: solid 1px rgba(0, 0, 0, 0.2);
  color: #f5f6f7;
  padding-left: 8px;
  padding-right: 20px;
  height: 40px;
  margin: 12px 8px;
  width: 202px;
  box-sizing: border-box;
`;

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  items: any[];
  click: any;
  styles?: any;
  isActiveMarked?: boolean;
  activeValue?: string;
  hasSearch?: boolean;
  resetSearchLabel?: string;
  needScroll?: boolean;
}

interface CustomSelectState {
  searchValue: string;
}

class CustomSelect extends React.Component<
  CustomSelectProps,
  CustomSelectState
> {
  constructor(props: CustomSelectProps) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }

  handleSearchChange(value: string) {
    this.setState({searchValue: value});
  }

  render() {
    const {
      items = [],
      click,
      styles,
      isActiveMarked = false,
      activeValue = '',
      hasSearch,
      resetSearchLabel,
      needScroll = false
    } = this.props;

    const EnhancedList = needScroll
      ? withStyledScroll({height: '100%'})(StyledList)
      : StyledList;

    return (
      <StyledSelect style={styles}>
        {resetSearchLabel && (
          <StyledItem
            key={''}
            className="reset-option"
            onClick={click('')}
            isActive={activeValue === ''}
          >
            {resetSearchLabel}
          </StyledItem>
        )}
        {hasSearch && (
          <StyledInput
            type="text"
            placeholder="Search"
            // tslint:disable-next-line:jsx-no-lambda
            onChange={e => this.handleSearchChange(e.target.value)}
          />
        )}
        <EnhancedList>
          {items.map((item: any) => {
            return (
              <StyledItem
                key={item.value}
                className={classnames({hidden: this.isItemFiltered(item)})}
                onClick={click(item.value)}
                isActive={isActiveMarked && activeValue === item.value}
              >
                {item.label}
              </StyledItem>
            );
          })}
        </EnhancedList>
      </StyledSelect>
    );
  }

  private isItemFiltered(item: Option) {
    return (
      !!this.state.searchValue &&
      item.label.toLowerCase().search(this.state.searchValue.toLowerCase()) ===
        -1
    );
  }
}

export default CustomSelect;
