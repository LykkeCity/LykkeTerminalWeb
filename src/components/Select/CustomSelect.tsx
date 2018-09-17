import * as React from 'react';
import styled from 'styled-components';
import {withStyledScroll} from '../CustomScrollbar';
import {css} from '../styled';

import {rem} from 'polished';

const StyledSelect = styled.div`
  position: absolute;
  z-index: 11;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.selectBackground};
  box-shadow: 0 10px 10px 0 ${props => props.theme.colors.boxShadow};
  border: solid 1px ${props => props.theme.colors.selectBorder};
  text-align: left;
  overflow: hidden;
  font-size: ${rem(14)};
`;

const StyledList = styled.div`
  overflow: auto;
`;

const StyledItem = styled.li.attrs({
  style: (props: any) => ({
    background: props.isActive
      ? props.theme.colors.selectActiveItem
      : 'transparent'
  })
})`
  cursor: pointer;
  font-size: 1rem;
  padding: ${rem(10)};

  ${(p: any) =>
    p.isActive ||
    css`
      &:hover {
        background-color: ${(props: any) =>
          props.theme.colors.selectItemHoveredBackground} !important;
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
};

export default CustomSelect;
