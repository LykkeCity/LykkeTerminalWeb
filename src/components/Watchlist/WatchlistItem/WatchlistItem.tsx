import * as React from 'react';
import {WatchlistItemProps} from '../';
import {supportedDesignedIcons} from '../../../constants/navigatorInfo';
import {Dir} from '../../../models';
import {FAIcon} from '../../Icon/Icon';
import {Icon} from '../../Icon/index';

const WatchlistItem: React.SFC<WatchlistItemProps> = ({
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
        {supportedDesignedIcons ? (
          <Icon color={color} name={`arrow-${side}`} />
        ) : (
          <FAIcon name={`fa-arrow-${side}`} />
        )}&nbsp;{name}
      </td>
      <td>{bid.toFixed(2)}</td>
      <td>{ask.toFixed(2)}</td>
    </tr>
  );
};

export default WatchlistItem;
