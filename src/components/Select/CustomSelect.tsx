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

  ${(p: any) =>
    p.isActive ||
    css`
      &:hover {
        background-color: rgba(0, 0, 0, 0.2) !important;
      }
    `};
` as any;

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
  needScroll?: boolean;
}

const CustomSelect: React.SFC<CustomSelectProps> = ({
  items = [],
  click,
  styles,
  isActiveMarked = false,
  activeValue,
  needScroll = false
}) => {
  const EnhancedList = needScroll
    ? withStyledScroll({height: '100%'})(StyledList)
    : StyledList;
  return (
    <StyledSelect style={styles}>
      <EnhancedList>
        {items.map((item: any) => {
          return (
            <StyledItem
              key={item.value}
              onClick={click(item.value, item.index)}
              isActive={isActiveMarked && activeValue === item.value}
            >
              {item.label}
            </StyledItem>
          );
        })}
      </EnhancedList>
    </StyledSelect>
  );
};

export default CustomSelect;
