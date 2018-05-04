import * as React from 'react';
import {WatchlistItemProps} from '../';
import {Dir} from '../../../models';
import {Icon} from '../../Icon/index';

const WatchlistItem: React.SFC<WatchlistItemProps> = ({
  id,
  name,
  bid,
  ask,
  side
}) => {
  const color = side === Dir.Up ? '#46eb6a' : '#ff6161';
  return (
    <tr style={{color}} key={id}>
      <td>
        <Icon color={color} name={`arrow-${side}`} />&nbsp;{name}
      </td>
      <td>{bid.toFixed(2)}</td>
      <td>{ask.toFixed(2)}</td>
    </tr>
  );
};

export default WatchlistItem;
