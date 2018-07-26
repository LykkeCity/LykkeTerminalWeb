import {shallow} from 'enzyme';
import * as React from 'react';
import NotAuthorized from '../NotAuthorized';

describe('<NotAuthorized>', () => {
  const signIn = jest.fn();

  const getTestNotAuthorized = () => {
    return <NotAuthorized signIn={signIn} />;
  };

  describe('method render', () => {
    it('should render Centered component', () => {
      const wrapper = shallow(getTestNotAuthorized());
      expect(wrapper.find('Centered')).toHaveLength(1);
    });

    it('should render Link component', () => {
      const wrapper = shallow(getTestNotAuthorized());
      expect(wrapper.find('Link')).toHaveLength(1);
    });
  });

  describe('event handlers', () => {
    it('signIn should be called by clicking Link', () => {
      const wrapper = shallow(getTestNotAuthorized());
      const link = wrapper.find('Link');
      link.simulate('click');
      expect(signIn).toHaveBeenCalled();
    });
  });
});
