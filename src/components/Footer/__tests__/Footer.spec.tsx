import {shallow} from 'enzyme';
import React from 'react';
import Footer from '../Footer';

describe('<Footer>', () => {
  const getTestFooter = () => {
    return <Footer />;
  };

  describe('method render', () => {
    it('should render connection status', () => {
      const wrapper = shallow(getTestFooter());
      expect(wrapper.find('inject-ConnectionStatus')).toHaveLength(1);
    });
  });
});
