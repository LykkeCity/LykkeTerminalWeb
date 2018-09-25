import {mount} from 'enzyme';
import * as React from 'react';
import withKyc from '../withKyc';

describe('withKyc', () => {
  class TestComponent extends React.Component<{}> {
    render() {
      return <div>Test</div>;
    }
  }

  const getTestComponentwithKyc = (withAction?: boolean) => {
    return withKyc(TestComponent, withAction);
  };

  describe('method render', () => {
    it('should render original component is KYC is passed', () => {
      const Component = getTestComponentwithKyc();
      const wrapper = mount(<Component isKycPassed={true} />);
      expect(wrapper.find('TestComponent')).toHaveLength(1);
    });

    it('should render DisabledContainer component', () => {
      const Component = getTestComponentwithKyc();
      const wrapper = mount(<Component />);
      expect(wrapper.find('DisabledContainer')).toHaveLength(1);
    });

    it('should render NotVerified component by default', () => {
      const Component = getTestComponentwithKyc();
      const wrapper = mount(<Component />);
      expect(wrapper.find('NotVerified')).toHaveLength(1);
    });

    it('should not render NotVerified component if withAction is false', () => {
      const Component = getTestComponentwithKyc(false);
      const wrapper = mount(<Component />);
      expect(wrapper.find('NotVerified')).toHaveLength(0);
    });
  });

  describe('method onDisabledClick', () => {
    it('should stop original callback on click', () => {
      const Component = getTestComponentwithKyc();
      const wrapper = mount(<Component />);
      const disabledContainer = wrapper.find('DisabledContainer');
      const onClick = (disabledContainer.props() as any).onClick;
      const event = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          outerHTML: ''
        }
      };
      onClick(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
