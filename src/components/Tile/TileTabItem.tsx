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

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50%;

  &:first-child {
    padding-right: 4px;
  }

  &:not(:first-child):last-child {
    padding-left: 4px;
  }
`;

const StyledSpan = styled.span`
  &.clickable {
    width: 100%;
    cursor: pointer;
    text-align: center;
    border-radius: ${rem(4)};
    padding: ${rem(7)} ${rem(10)};
    border: solid 1px rgba(140, 148, 160, 0.4);
  }

  &.active {
    border-color: #0388ef;
    box-shadow: inset 0 0 0 1px #0388ef;
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
    <StyledColumn>
      <StyledSpan className={classes.join(' ')} key={index} onClick={click}>
        {tabName}
      </StyledSpan>
    </StyledColumn>
  );
};

export default TileTabItemItem;
