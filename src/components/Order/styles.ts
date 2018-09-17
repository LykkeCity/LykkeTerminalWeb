import {rem} from 'polished';
import styled, {css} from 'styled-components';
import {Side} from '../../models';
import {Dictionary} from '../../types';
import {greyButton} from '../styled';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const Markets = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${rem(16)};
  border-bottom: 1px solid ${props => props.theme.colors.tabsHeaderBorder};
`;

export const Actions = Markets.extend`
  justify-content: center;
  border-bottom: none;
`;

const buttonColorBySide = (
  side: Side,
  isActive: boolean,
  colors: Dictionary<string>
) => {
  return isActive
    ? side === Side.Sell
      ? colors.orderSellButton
      : colors.orderBuyButton
    : colors.switchButtonBackground;
};

export const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  ${(p: any) =>
    p.side === Side.Buy
      ? css`
          padding-right: 4px;
        `
      : css`
          padding-left: 4px;
        `};
` as any;

export const ActionProperty = styled.div.attrs({
  style: (props: any) => ({
    backgroundColor: buttonColorBySide(
      props.side,
      props.isActive,
      props.theme.colors
    ),
    color: props.isActive
      ? props.side === Side.Buy
        ? props.theme.colors.buyButtonText
        : props.theme.colors.sellButtonText
      : props.theme.colors.inactiveItemText
  })
})`
  background-color: ${props => props.theme.colors.switchButtonBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: ${rem(14)};
  font-weight: 600;
  line-height: 1.14;
  text-align: center;
  text-transform: capitalize;
  padding: 10px;
  height: 32px;
  width: 100%;
  border-radius: 4px;
` as any;

export const MarketButton = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: -2px;

  &:not(:last-child) {
    margin-right: ${rem(22)};
  }
`;

export const MarketProperty = styled.div`
  cursor: pointer;
  text-align: center;
  padding: ${rem(9)} 0 ${rem(11)};
  color: ${props => props.theme.colors.inactiveItemText};
  font-size: ${rem(18)};
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: ${props => props.theme.colors.activeItemBorder};
    color: ${props => props.theme.colors.activeItemText};
    font-weight: 600;
  }
`;

export const ConfirmButton = styled.button.attrs({
  style: (props: any) =>
    ({
      cursor: `${props.disabled ? 'not-allowed' : 'pointer'}`,
      opacity: `${props.disabled ? '0.5' : '1'}`
    } as any)
})`
  width: 100%;
  min-height: ${rem(50)};
  border-radius: 4px;
  font-size: ${rem(16)};
  height: 48px;
  padding: ${rem(12)} ${rem(20)};
  font-weight: bold;
  line-height: 1;
  color: ${props => props.theme.colors.buttonColor};
  outline: none;
  border: none;
  font-family: 'Proxima Nova', sans-serif;
  background-color: ${props => props.theme.colors.buttonBackground};
  border: solid 1px ${props => props.theme.colors.buttonBorder};

  &.disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Total = Flex.extend`
  justify-content: space-between;
  border-top: 1px solid rgb(45, 45, 45);
  border-bottom: 1px solid rgb(45, 45, 45);
  padding: ${rem(8)} 0;
  margin: ${rem(5)} 0;
`;

export const TotalHint = styled.small`
  display: block;
  margin-top: ${rem(2)};
  color: ${props => props.theme.colors.totalHintText};
  font-size: ${rem(12)};
  text-align: right;
`;

export const OrderTitle = styled.div`
  font-size: ${rem(16)};
  font-weight: 600;

  &.estimated-total {
    min-width: 40%;
  }
`;

export const MarketConfirmButton = styled.div`
  margin-top: ${rem(24)};
`;

export const Note = styled.div`
  font-size: ${rem(14)};
  color: ${props => props.theme.colors.noteText};
`;

export const Amount = styled.div`
  color: ${props => props.theme.colors.amountText};
  font-size: ${rem(14)};
  text-align: right;
`;

export const MarketAmount = styled.div.attrs({
  style: (props: any) => ({
    color: `${
      props.available
        ? props.theme.colors.inactiveItemText
        : props.theme.colors.marketAmountText
    }`
  })
})`
  font-size: ${rem(14)};
  text-align: right;
` as any;

export const Available = styled(Amount).attrs({
  style: (props: any) => ({
    cursor: `${props.disabled ? 'auto' : 'pointer'}`
  })
})`
  text-align: right;
` as any;

export const Action = styled.div`
  font-size: ${rem(16)};
  font-weight: 600;
  &:first-letter {
    text-transform: capitalize;
  }
`;

export const Reset = Flex.extend`
  color: ${(props: any) => props.theme.colors.resetButton};
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  padding: ${rem(8)} 0;

  span:hover {
    cursor: pointer;
  }
`;

export const InputControl = styled.div`
  margin: ${rem(10)} 0;
`;

export const StyledOrderButton = styled.div`
  margin-top: ${rem(8)};
  margin-bottom: ${rem(8)};
`;

export const DisclaimerNotification = styled.div`
  border-radius: ${rem(6)};
  box-shadow: 0 10px 10px 0 ${props => props.theme.colors.boxShadow};
  margin: 0 0 ${rem(16)};
  padding: ${rem(24)} ${rem(16)} ${rem(16)};
  position: relative;
  background-color: ${props =>
    props.theme.colors.disclaimerNotificationBackground};
`;

export const Body = styled.div`
  font-family: 'Proxima Nova';
  font-size: 12px;
  line-height: 1.14;
  margin-top: 12px;
  color: ${props => props.theme.colors.text};
  margin-top: ${rem(14)};
`;

export const Title = styled.div`
  font-family: Akrobat;
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  color: ${props => props.theme.colors.text};
`;

export const Link = styled.a`
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  text-decoration: underline;
`;

export const Percent = styled.div`
  color: ${props => props.theme.colors.choosableItemText};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: ${rem(8)} 0;
  border: 1px solid transparent;
  font-size: ${rem(14)};
  display: flex;
  justify-content: center;
  margin-bottom: ${rem(4)};
  opacity: 1;

  div {
    border-left: 1px solid ${greyButton.borderColor};
    width: 100%;
    text-align: center;
  }

  &.active {
    border: 1px solid ${greyButton.borderColor};
    border-radius: ${greyButton.borderRadius};

    div {
      border-left: 1px solid transparent;
    }
  }

  &:first-child {
    div {
      border-left: 1px solid transparent;
    }
  }

  &:hover,
  &.active + div:hover {
    border: 1px solid ${greyButton.borderColor};
    border-left: 1px solid ${greyButton.borderColor};
    border-radius: ${greyButton.borderRadius};
    cursor: pointer;

    div {
      border-left: 1px solid transparent;
    }
  }

  &:hover + div,
  &.active + div {
    div {
      border-left: 1px solid transparent;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: auto;

    &.active,
    &.active + div {
      border: 1px solid transparent;

      div {
        border-left: 1px solid ${greyButton.borderColor};
      }
    }

    &:hover,
    &.disabled + div {
      border: 1px solid transparent;
      cursor: auto;

      div {
        border-left: 1px solid ${greyButton.borderColor};
      }

      &:first-child div {
        border-left: 1px solid transparent;
      }
    }
  }
`;
