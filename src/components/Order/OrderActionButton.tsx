import {rem, rgba} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import Side from '../../models/side';
import {colors, css} from '../styled';
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
`;

const StyledActionChoice = styled.div.attrs({
  style: (props: any) => ({
    backgroundColor: buttonColorBySide(props.side, props.isActive),
    color:
      props.side === Side.Buy.toLowerCase() && props.isActive
        ? '#333'
        : colors.white
  })
})`
  background: transparent;
  border: solid 1px ${(p: any) => buttonBorderColorBySide(p.isActive)};
  cursor: pointer;
  font-size: ${rem(14)};
  font-weight: 600;
  line-height: 1.14;
  text-align: center;
  text-transform: capitalize;
  padding: ${rem(8)} ${rem(58)};
  width: 100%;
  border-radius: 4px;

  ${(p: any) =>
    p.side === Side.Sell.toLowerCase()
      ? css`
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        `
      : css`
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: none;
        `};
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
