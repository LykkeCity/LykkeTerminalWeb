import * as React from 'react';
import styled, {colorFromSide} from '../styled';

interface TradeListCellProps {
  className?: string;
  side: string;
}

const TradeListCell: React.SFC<TradeListCellProps> = ({
  children,
  className,
  side
}) => <span className={className}>{children}</span>;

const StyledTradeListCell = styled(TradeListCell)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListCell;
