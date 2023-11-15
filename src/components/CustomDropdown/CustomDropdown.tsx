import {DropdownControl} from '@lykkecity/react-components';
import React from 'react';
import {FiChevronDown} from 'react-icons/fi';
import {
  StyledDropdown,
  StyledDropdownContainer,
  StyledDropdownControlButton,
  StyledDropdownControlParent,
  StyledDropdownList,
  StyledDropdownListItem
} from './styles';

export interface ListItem {
  label: string;
  value: string;
}

export interface CustomDropdownProps {
  controlButtonName: string;
  items: ListItem[];
  selectedValue: string;
  onClick: (value: string) => void;
}

export interface CustomDropdownState {
  isOpened: boolean;
}

class CustomDropdown extends React.Component<
  CustomDropdownProps,
  CustomDropdownState
> {
  constructor(props: CustomDropdownProps) {
    super(props);

    this.state = {
      isOpened: false
    };
  }

  onOpen() {
    this.setState({isOpened: true});
  }

  onClose() {
    this.setState({isOpened: false});
  }

  onItemSelect = (value: string) => {
    this.props.onClick(value);
    this.onClose();
  };

  renderControl() {
    return (
      <DropdownControl>
        <StyledDropdownControlButton>
          {this.props.controlButtonName}
          {this.renderControlButton()}
        </StyledDropdownControlButton>
      </DropdownControl>
    );
  }

  renderControlButton() {
    return (
      <StyledDropdownControlParent>
        <FiChevronDown />
      </StyledDropdownControlParent>
    );
  }

  renderContainer() {
    return (
      <StyledDropdownContainer>
        <StyledDropdownList>
          {this.props.items.map((item: ListItem) => (
            <StyledDropdownListItem
              key={item.value}
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => this.onItemSelect(item.value)}
              className={
                this.props.selectedValue === item.value ? 'isActive' : ''
              }
            >
              {item.label}
            </StyledDropdownListItem>
          ))}
        </StyledDropdownList>
      </StyledDropdownContainer>
    );
  }

  render() {
    return (
      <StyledDropdown
        trigger={'click'}
        isOpen={this.state.isOpened}
        // tslint:disable-next-line:jsx-no-lambda
        onOpen={() => this.onOpen()}
        // tslint:disable-next-line:jsx-no-lambda
        onClose={() => this.onClose()}
      >
        {this.renderControl()}
        {this.renderContainer()}
      </StyledDropdown>
    );
  }
}

export default CustomDropdown;
