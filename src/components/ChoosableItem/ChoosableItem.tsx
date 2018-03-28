import * as React from 'react';
import {Item} from './styles';

interface ChoosableItemProps {
  value: number;
  description: string;
  onClick: any;
  isActive: boolean;
}

const ChoosableItem: React.SFC<ChoosableItemProps> = ({
  value,
  isActive,
  onClick,
  description
}) => {
  return (
    <Item className={isActive ? 'active' : ''} onClick={onClick}>
      <div>
        {value}
        {description}
      </div>
    </Item>
  );
};

export default ChoosableItem;
