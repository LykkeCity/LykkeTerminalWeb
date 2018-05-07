import {rem} from 'polished';
import styled, {css} from 'styled-components';
import {Side} from '../../models';
import {colors} from '../styled';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const Markets = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${rem(16)};
  border-bottom: 1px solid #2d2d2d;
`;

export const Actions = Markets.extend`
  justify-content: center;
  border-bottom: none;
  margin-bottom: ${rem(30)};
`;

const buttonColorBySide = (side: string, isActive: boolean) => {
  return isActive
    ? side === Side.Sell.toLowerCase() ? colors.red : colors.green
    : '#272727';
};

export const ActionButton = styled.div`
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

export const ActionProperty = styled.div.attrs({
  style: (props: any) => ({
    backgroundColor: buttonColorBySide(props.side, props.isActive),
    color: props.isActive
      ? props.side === Side.Buy.toLowerCase() ? '#333' : colors.white
      : '#8c94a0'
  })
})`
  background-color: #272727;
  color: ${colors.white};
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
  color: ${colors.coolGrey};
  font-size: ${rem(18)};
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: ${colors.blue};
    color: ${colors.snowWhite};
    font-weight: 600;
  }
`;

export const ConfirmButton = styled.button.attrs({
  style: (props: any) => ({
    cursor: `${props.disabled ? 'not-allowed' : 'pointer'}`,
    opacity: `${props.disabled ? '0.5' : '1'}`
  })
})`
  width: 100%;
  min-height: ${rem(50)};
  border-radius: 4px;
  font-size: ${rem(16)};
  height: 48px;
  padding: ${rem(12)} ${rem(20)};
  font-weight: bold;
  line-height: 1;
  color: #ffffff;
  outline: none;
  border: none;
  font-family: 'Proxima Nova', sans-serif;
  background-color: #0388ef;
  border: solid 1px #0388ef;

  &.disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const LimitTotal = Flex.extend`
  justify-content: space-between;
  border-top: 1px solid rgb(45, 45, 45);
  border-bottom: 1px solid rgb(45, 45, 45);
  padding: ${rem(19)} 0;
  margin: ${rem(23)} 0;
`;

export const LimitTitle = styled.div`
  font-size: ${rem(16)};
  font-weight: 600;
`;

export const MarketConfirmButton = styled.div`
  margin-top: ${rem(24)};
`;

export const Note = styled.div`
  font-size: ${rem(14)};
  color: #fff;
`;

export const Amount = styled.div`
  color: #8c94a0;
  font-size: ${rem(14)};
`;

export const Available = styled(Amount)`
  &:hover {
    cursor: pointer;
  }
`;

export const Action = styled.div`
  font-size: ${rem(16)};
  font-weight: 600;
  &:first-letter {
    text-transform: capitalize;
  }
`;

export const Reset = Flex.extend`
  color: rgb(3, 136, 239);
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  padding: ${rem(19)} 0;

  span:hover {
    cursor: pointer;
  }
`;

export const InputControl = styled.div`
  margin: ${rem(8)} 0;

  & + & {
    margin-top: ${rem(20)};
  }
`;

export const StyledOrderButton = styled.div`
  margin-top: ${rem(32)};
  margin-bottom: ${rem(10)};
`;
