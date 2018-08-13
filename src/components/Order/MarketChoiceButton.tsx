import * as React from 'react';
import {MarketButton, MarketProperty} from './styles';

interface MarketChoiceButtonProps {
  title: string;
  click: () => void;
  isActive: boolean;
}

const MarketChoiceButton: React.SFC<MarketChoiceButtonProps> = ({
  title,
  click,
  isActive
}) => {
  const classes = isActive ? 'active' : '';
  return (
    <MarketButton>
      <MarketProperty onClick={click} className={classes}>
        {title}
      </MarketProperty>
    </MarketButton>
  );
};

export default MarketChoiceButton;
