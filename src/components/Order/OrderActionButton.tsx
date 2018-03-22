import {rem, rgba} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import Side from '../../models/side';
import {css} from '../styled';
import {OrderChoiceButtonProps} from './index';

const buttonColorBySide = (side: string, isActive: boolean) => {
  return isActive
    ? side === Side.Sell.toLowerCase() ? '#ab00ff' : '#fb8f01'
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
    backgroundColor: buttonColorBySide(props.side, props.isActive)
  })
})`
  background: transparent;
  border: solid 1px ${(p: any) => buttonBorderColorBySide(p.isActive)};
  color: rgb(245, 246, 247);
  cursor: pointer;
  font-size: ${rem(14)};
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
