import {mount} from 'enzyme';
import * as React from 'react';
import withKYC from '../withKYC';

describe('withKYC', () => {
  class TestComponent extends React.Component<{}> {
    render() {
      return <div>Test</div>;
    }
  }

  const getTestComponentWithKYC = (withAction?: boolean) => {
    return withKYC(TestComponent, withAction);
  };

  describe('method render', () => {
    it('should render original component is KYC is passed', () => {
      const Component = getTestComponentWithKYC();
      const wrapper = mount(<Component isKycPassed={true} />);
      expect(wrapper.find('TestComponent')).toHaveLength(1);
    });

    it('should render DisabledContainer component', () => {
      const Component = getTestComponentWithKYC();
      const wrapper = mount(<Component />);
      expect(wrapper.find('DisabledContainer')).toHaveLength(1);
    });

    it('should render NotVerified component by default', () => {
      const Component = getTestComponentWithKYC();
      const wrapper = mount(<Component />);
      expect(wrapper.find('NotVerified')).toHaveLength(1);
    });

    it('should not render NotVerified component if withAction is false', () => {
      const Component = getTestComponentWithKYC(false);
      const wrapper = mount(<Component />);
      expect(wrapper.find('NotVerified')).toHaveLength(0);
    });
  });

  describe('method onDisabledClick', () => {
    it('should stop original callback on click', () => {
      const Component = getTestComponentWithKYC();
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
