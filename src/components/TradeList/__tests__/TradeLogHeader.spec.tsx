import {shallow} from 'enzyme';
import React from 'react';
import {InstrumentModel} from '../../../models';
import TradeLogHeader from '../TradeLogHeader';

describe('<TradeLogHeader>', () => {
  const instrument = new InstrumentModel({});
  const getTestTradeLogHeader = () => (
    <TradeLogHeader selectedInstrument={instrument} />
  );

  describe('method render', () => {
    it('should render TableHeaderWithoutSort component', () => {
      const wrapper = shallow(getTestTradeLogHeader());
      expect(wrapper.find('TableHeaderWithoutSort')).toHaveLength(1);
    });

    it('should pass three columns', () => {
      const wrapper = shallow(getTestTradeLogHeader());
      expect(wrapper.props().headers).toHaveLength(3);
    });
  });
});
