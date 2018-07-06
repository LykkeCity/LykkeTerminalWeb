import * as React from 'react';
import {MarketButton, MarketProperty} from './styles';

interface MarketChoiceButtonProps {
  id: string;
  title: string;
  click: () => void;
  isActive: boolean;
}

const MarketChoiceButton: React.SFC<MarketChoiceButtonProps> = ({
  id,
  title,
  click,
  isActive
}) => {
  const classes = isActive ? 'active' : '';
  return (
    <MarketButton>
      <MarketProperty id={id} onClick={click} className={classes}>
        {title}
      </MarketProperty>
    </MarketButton>
  );
};

export default MarketChoiceButton;
