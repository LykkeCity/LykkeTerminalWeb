import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';

interface TileTabItemProps {
  tabName: string;
  key?: string;
  isClickable: boolean;
  click: any;
  index: number;
  activeIndex: number;
}

const StyledSpan = styled.span`
  margin-right: 5px;
  &.clickable {
    border-radius: 4px;
    border: solid 1px rgba(140, 148, 160, 0.4);
    color: #ccc;
    padding: ${rem(8)} ${rem(18)};
    &:hover {
      cursor: pointer;
    }
  }
  &.active {
    color: #f5f6f7;
  }
`;

const TileTabItemItem: React.SFC<TileTabItemProps> = ({
  tabName,
  isClickable,
  click,
  index,
  activeIndex
}) => {
  const classes = [];
  if (isClickable) {
    classes.push('clickable');
    if (index === activeIndex) {
      classes.push('active');
    }
  }
  return (
    <StyledSpan className={classes.join(' ')} key={index} onClick={click}>
      {tabName}
    </StyledSpan>
  );
};

export default TileTabItemItem;
