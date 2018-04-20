import {rem, rgba} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import Side from '../../models/side';
import {css} from '../styled';
import {OrderChoiceButtonProps} from './index';

const buttonColorBySide = (side: string, isActive: boolean) => {
  return isActive
    ? side === Side.Sell.toLowerCase() ? '#ff6161' : '#46eb6a'
    : 'transparent';
};

const buttonBorderColorBySide = (isActive: boolean) => {
  return isActive ? rgba(0, 0, 0, 0.2) : rgba(140, 148, 160, 0.4);
};

const StyledColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;

  ${(p: any) =>
    p.side === Side.Sell.toLowerCase()
      ? css`
          padding-right: 4px;
        `
      : css`
          padding-left: 4px;
        `};
` as any;

const StyledActionChoice = styled.div.attrs({
  style: (props: any) => ({
    backgroundColor: buttonColorBySide(props.side, props.isActive)
  })
})`
  background: transparent;
  border: solid 1px ${(p: any) => buttonBorderColorBySide(p.isActive)};
  color: rgb(245, 246, 247);
  cursor: pointer;
  font-size: ${rem(14)};
  font-weight: 600;
  line-height: 1.14;
  text-align: center;
  text-transform: capitalize;
  padding: ${rem(8)} ${rem(58)};
  width: 100%;
  border-radius: 4px;
` as any;

const OrderActionButton: React.SFC<OrderChoiceButtonProps> = ({
  title,
  click,
  isActive
}) => (
  <StyledColumn side={title}>
    <StyledActionChoice onClick={click} side={title} isActive={isActive}>
      {title}
    </StyledActionChoice>
  </StyledColumn>
);

export default OrderActionButton;
