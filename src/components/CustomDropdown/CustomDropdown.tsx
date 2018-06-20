import {DropdownControl} from 'lykke-react-components';
import React from 'react';
import {DynamicFAIcon} from '../Icon/Icon';
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

interface CustomDropdownState {
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
      <React.Fragment>
        <StyledDropdownControlParent
          style={{display: this.state.isOpened ? 'block' : 'none'}}
        >
          <DynamicFAIcon name="angle-up" key="angle-up" />
        </StyledDropdownControlParent>
        <StyledDropdownControlParent
          style={{display: this.state.isOpened ? 'none' : 'block'}}
        >
          <DynamicFAIcon name="angle-down" key="angle-down" />
        </StyledDropdownControlParent>
      </React.Fragment>
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
