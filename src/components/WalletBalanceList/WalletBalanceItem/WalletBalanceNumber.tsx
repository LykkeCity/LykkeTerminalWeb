import {rem} from 'polished';
import * as React from 'react';
import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import styled, {colors} from '../../styled';

const StyledNumber = styled.div`
  color: ${(p: any) => p.color};
  font-family: Lekton, monospace;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  span {
    color: #f5f6f7;
  }

  &.clickable {
    cursor: pointer;
  }
`;
StyledNumber.displayName = 'StyledNumber';

const StyledTotalHint = styled.div`
  font-size: ${rem(12)};
  color: ${colors.lightGrey};
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
  color = '#ffffff',
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
