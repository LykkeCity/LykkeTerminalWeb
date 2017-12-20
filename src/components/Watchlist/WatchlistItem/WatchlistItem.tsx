import * as React from 'react';
import {WatchlistItemInterface} from '../';
import Dir from '../../../stores/dir';
import {Icon} from '../../Icon/index';

const WatchlistItem: React.SFC<WatchlistItemInterface> = ({
  id,
  name,
  bid,
  ask,
  side
}) => {
  const color = side === Dir.Up ? '#13b72a' : '#ff3e2e';
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
