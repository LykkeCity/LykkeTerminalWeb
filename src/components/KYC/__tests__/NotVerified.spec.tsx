import {shallow} from 'enzyme';
import * as React from 'react';
import NotVerified from '../NotVerified';

describe('<NotVerified>', () => {
  const href = 'test.com';
  const getTestNotVerified = () => {
    return <NotVerified href={href} />;
  };

  describe('method render', () => {
    it('should render Centered component', () => {
      const wrapper = shallow(getTestNotVerified());
      expect(wrapper.find('Centered')).toHaveLength(1);
    });

    it('should render Link component', () => {
      const wrapper = shallow(getTestNotVerified());
      expect(wrapper.find('Link')).toHaveLength(1);
    });

    it('should render Link with returnUrl set to href from param', () => {
      const wrapper = shallow(getTestNotVerified());
      const link = wrapper.find('Link');
      expect((link.props() as any).href).toBe(href);
    });
  });
});
