import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import Side from '../../models/side';
import {OrderChoiceButtonProps} from './index';

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

const buttonColorBySide = (side: string, isActive: boolean) => {
  return isActive
    ? side === Side.Sell.toLowerCase() ? '#ab00ff' : '#fb8f01'
    : '#2d2d2d';
};

const StyledActionChoice = styled.div.attrs({
  style: (props: any) => ({
    backgroundColor: buttonColorBySide(props.side, props.isActive),
    opacity: props.isActive ? '1' : '0.4'
  })
})`
  width: 100%;
  cursor: pointer;
  text-align: center;
  border-radius: ${rem(4)};
  padding: ${rem(7)} ${rem(12)};
  border: solid 1px rgba(140, 148, 160, 0.4);
  text-transform: capitalize;
  color: #f5f6f7;
` as any;

const OrderActionButton: React.SFC<OrderChoiceButtonProps> = ({
  title,
  click,
  isActive
}) => (
  <StyledColumn>
    <StyledActionChoice onClick={click} side={title} isActive={isActive}>
      {title}
    </StyledActionChoice>
  </StyledColumn>
);

export default OrderActionButton;
