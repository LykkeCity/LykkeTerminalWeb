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
    color: #ccc;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  &.active {
    color: #fff;
    text-decoration: underline;
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
