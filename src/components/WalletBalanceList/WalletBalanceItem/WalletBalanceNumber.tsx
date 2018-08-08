import {rem} from 'polished';
import * as React from 'react';
import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import styled from '../../styled';

const StyledNumber = styled.div`
  color: ${(props: any) => props.color || props.theme.colors.balanceNumberText};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  span {
    color: ${props => props.theme.colors.defaultText};
  }

  &.clickable {
    cursor: pointer;
  }
`;
StyledNumber.displayName = 'StyledNumber';

const StyledTotalHint = styled.div`
  font-size: ${rem(12)};
  color: ${props => props.theme.colors.balanceTotalHintText};
  padding-top: 4px;
`;
StyledTotalHint.displayName = 'StyledTotalHint';

interface WalletBalanceNumberProps {
  availableBalance: number;
  totalBalance: number;
  accuracy: number;
  color?: string;
  onClick?: () => void;
}

const WalletBalanceNumber: React.SFC<WalletBalanceNumberProps> = ({
  availableBalance,
  totalBalance,
  accuracy,
  color,
  onClick,
  children
}) => {
  const formatterAvailableBalance = formattedNumber(availableBalance, accuracy);
  const formatterTotalBalance = formattedNumber(totalBalance, accuracy);
  return (
    <StyledNumber
      color={color}
      title={formatterAvailableBalance}
      onClick={onClick}
      className={onClick ? 'clickable' : ''}
    >
      <div>
        {formatterAvailableBalance}
        {children}
      </div>
      <StyledTotalHint>{formatterTotalBalance} in total</StyledTotalHint>
    </StyledNumber>
  );
};

export default WalletBalanceNumber;
