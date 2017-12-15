import * as React from 'react';
import {Icon} from '../Icon/index';
import {Table} from '../Table/index';

const OrderList = () => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Cancel</th>
        <th>OrderID</th>
        <th>Side</th>
        <th>Volume</th>
        <th>Open Price</th>
        <th>Current Price</th>
        <th>Created Date</th>
        <th>Expiry Date</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>BTCUSD</td>
        <td>
          <Icon name="cross" />
        </td>
        <td>19554426815747399afcc</td>
        <td style={{color: '#ffae2c'}}>Buy</td>
        <td>1</td>
        <td>7 465.800</td>
        <td style={{color: '#13b72a'}}>6 565.250</td>
        <td>23:45 15.01.2018</td>
        <td>Good till cancel</td>
        <td>
          <Icon name="pencil" />
        </td>
      </tr>
      <tr>
        <td>EURUSD</td>
        <td>
          <Icon name="cross" />
        </td>
        <td>19554426sd5f4sd54fsd6</td>
        <td style={{color: '#d070ff'}}>Sell</td>
        <td>18</td>
        <td>6 496.321</td>
        <td style={{color: '#ff3e2e'}}>6 496.322</td>
        <td>23:45 15.01.2018</td>
        <td>-</td>
        <td>
          <Icon name="pencil" />
        </td>
      </tr>
    </tbody>
  </Table>
);

export default OrderList;
